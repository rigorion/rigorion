import React, { useState } from 'react';
import { SlidersHorizontal, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterOption = {
  id: string;
  label: string;
};

interface FilterButtonProps {
  options: FilterOption[];
  onFilterChange: (selectedFilters: string[]) => void;
  className?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  options,
  onFilterChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => {
      const newFilters = prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId];
      
      // Call the callback with updated filters
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full text-sm',
          'bg-white border border-slate-200 shadow-sm',
          'hover:bg-slate-50 transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-light focus:ring-opacity-50',
          selectedFilters.length > 0 && 'border-blue text-blue'
        )}
      >
        <SlidersHorizontal size={16} />
        <span>
          {selectedFilters.length === 0
            ? 'Filter'
            : `Filters (${selectedFilters.length})`}
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div className={cn(
            'absolute right-0 mt-2 z-20 w-56 p-2',
            'bg-white rounded-lg shadow-lg border border-slate-200',
            'animate-fade-in',
          )}>
            <div className="text-sm font-medium px-3 py-2 text-slate-500">
              Filter by
            </div>
            <div className="space-y-1">
              {options.map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleFilter(option.id)}
                  className={cn(
                    'flex items-center justify-between w-full px-3 py-2 text-sm rounded-md',
                    'hover:bg-slate-50 transition-colors',
                    'focus:outline-none focus:bg-slate-50',
                    selectedFilters.includes(option.id) && 'text-blue bg-blue-light bg-opacity-40'
                  )}
                >
                  <span>{option.label}</span>
                  {selectedFilters.includes(option.id) && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterButton;
