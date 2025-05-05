
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target, Navigation, ChevronDown, LogOut, Palette, BookOpen } from "lucide-react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/components/auth/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import ModulesDialog from "./ModulesDialog";

interface PracticeHeaderProps {
  onToggleSidebar: () => void;
  onOpenObjective: () => void;
  onOpenMode: () => void;
  mode: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  // New styling props
  onUpdateStyle?: (key: string, value: string | number) => void;
  fontFamily?: string;
  fontSize?: number;
  contentColor?: string;
  keyPhraseColor?: string;
  formulaColor?: string;
}

export const PracticeHeader = ({ 
  onToggleSidebar, 
  onOpenObjective, 
  onOpenMode, 
  mode,
  sidebarOpen,
  setSidebarOpen,
  onUpdateStyle,
  fontFamily = 'source-sans',
  fontSize = 14,
  contentColor = '#304455',
  keyPhraseColor = '#2563eb',
  formulaColor = '#dc2626'
}: PracticeHeaderProps) => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);

  const pages = [
    { name: "Home", path: "/" },
    { name: "Practice", path: "/practice" },
    { name: "Progress", path: "/progress" },
    { name: "Chat", path: "/chat" },
    { name: "About", path: "/about" },
  ];

  const chapters = [
    "Chapter 1: Introduction to Mathematics",
    "Chapter 2: Basic Algebra",
    "Chapter 3: Geometry Fundamentals",
    "Chapter 4: Probability & Statistics",
    "Chapter 5: Advanced Functions"
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };

  const getUserInitials = (): string => {
    if (profile?.name) {
      return profile.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <header className="border-b px-6 py-4 flex items-center justify-between bg-white shadow-sm transition-all duration-300">
      <div className="flex items-center gap-4">
        <DropdownMenu open={isNavDropdownOpen} onOpenChange={setIsNavDropdownOpen}>
          <DropdownMenuTrigger className="rounded-lg p-2 hover:bg-gray-100 transition-colors">
            <Navigation className="h-5 w-5 text-blue-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-white border border-gray-200 shadow-lg rounded-lg p-2">
            <ScrollArea className="h-auto max-h-[300px]">
              {pages.map((page, index) => (
                <DropdownMenuItem 
                  key={index}
                  className="cursor-pointer py-2 hover:bg-gray-100 rounded-sm transition-colors"
                  onClick={() => handleNavigation(page.path)}
                >
                  <span className="font-source-sans text-[#304455]">{page.name}</span>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        <h1
          className="text-xl font-bold text-gray-800 font-cursive"
        >
          Academic Arc
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Renamed Modules to Exams - ModulesDialog component is used */}
        <ModulesDialog />

        {/* Chapters Dropdown */}
        <DropdownMenu open={isChapterDropdownOpen} onOpenChange={setIsChapterDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full bg-transparent hover:bg-gray-100 transition-colors"
            >
              <Target className="h-4 w-4 mr-1.5 text-blue-500" />
              Chapters
              <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isChapterDropdownOpen ? "rotate-180" : ""}`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-lg rounded-lg p-2">
            <ScrollArea className="h-[300px]">
              {chapters.map((chapter, index) => (
                <DropdownMenuItem 
                  key={index}
                  className="cursor-pointer py-2 px-3 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <span className="font-source-sans text-[#304455] text-sm">{chapter}</span>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Styling Button */}
        {onUpdateStyle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onUpdateStyle}
            className="rounded-full bg-transparent hover:bg-gray-100 transition-colors"
          >
            <Palette className="h-4 w-4 mr-1.5 text-blue-500" />
            Styling
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenObjective}
          className="rounded-full bg-transparent hover:bg-gray-100 transition-colors"
        >
          <Target className="h-4 w-4 mr-1.5 text-blue-500" />
          Set Objectives
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenMode}
          className={`rounded-full bg-transparent hover:bg-gray-100 transition-colors ${mode !== "manual" ? "text-emerald-500" : ""}`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="h-4 w-4 mr-1.5"
          >
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          {mode === "manual" ? "Manual" : mode.charAt(0).toUpperCase() + mode.slice(1)}
        </Button>

        <div className="ml-2 flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-blue-500 text-white text-xs">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg rounded-md p-1">
              <DropdownMenuItem 
                className="cursor-pointer py-2 hover:bg-gray-100 rounded-sm transition-colors flex items-center text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default PracticeHeader;
