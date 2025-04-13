
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from 'lucide-react';
import SearchBar from './SearchBar';
import FilterButton from './FilterButton';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onSearch: (query: string) => void;
  onFilterChange: (selectedFilters: string[]) => void;
  filterOptions: {
    id: string;
    label: string;
  }[];
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  onSearch,
  onFilterChange,
  filterOptions,
  className
}) => {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const navigateToPage = (path: string) => {
    navigate(path);
    setIsNavOpen(false);
  };

  return (
    <header className={cn('sticky top-0 z-50 w-full py-4 bg-white/80 backdrop-blur-sm border-b border-slate-100', 'transition-all duration-300', className)}>
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between">
          <div className="relative flex items-center gap-4">
            <DropdownMenu open={isNavOpen} onOpenChange={setIsNavOpen}>
              <DropdownMenuTrigger className="rounded-lg p-2 hover:bg-gray-100 transition-colors">
                <Navigation className="h-5 w-5 text-blue-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onSelect={() => navigateToPage('/')}>
                  Home
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigateToPage('/practice')}>
                  Practice
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigateToPage('/progress')}>
                  Progress
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigateToPage('/chat')}>
                  Chat
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigateToPage('/about')}>
                  About
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <h1 className="font-cursive text-2xl sm:text-3xl text-red-dark font-semibold italic">Rigorion</h1>
            <div className="absolute -bottom-1 left-0 w-16 h-0.5 bg-blue opacity-50 rounded-full"></div>
          </div>
          
          <div className="flex items-center gap-2">
            <SearchBar onSearch={onSearch} />
            <FilterButton options={filterOptions} onFilterChange={onFilterChange} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
