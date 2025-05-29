
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target, Navigation, ChevronDown, LogOut, Bell, Filter, Moon, Sun } from "lucide-react";
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
import { useTheme } from "@/contexts/ThemeContext";

interface PracticeHeaderProps {
  onToggleSidebar: () => void;
  onOpenObjective: () => void;
  onOpenMode: () => void;
  mode: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onFilterChange?: (filters: { chapter?: string; module?: string }) => void;
}

export const PracticeHeader = ({ 
  onToggleSidebar, 
  onOpenObjective, 
  onOpenMode, 
  mode,
  sidebarOpen,
  setSidebarOpen,
  onFilterChange
}: PracticeHeaderProps) => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState<string>("All Chapters");
  const [selectedModule, setSelectedModule] = useState<string>("All Modules");

  const pages = [
    { name: "Home", path: "/" },
    { name: "Practice", path: "/practice" },
    { name: "Progress", path: "/progress" },
    { name: "Chat", path: "/chat" },
    { name: "About", path: "/about" },
  ];

  const chapters = [
    "All Chapters",
    "Chapter 1",
    "Chapter 2", 
    "Chapter 3",
    "Chapter 4",
    "Chapter 5"
  ];

  const modules = [
    "All Modules",
    "Algebra",
    "Geometry", 
    "Calculus",
    "Statistics",
    "Trigonometry"
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };

  const handleChapterFilter = (chapter: string) => {
    setSelectedChapter(chapter);
    setIsChapterDropdownOpen(false);
    
    if (onFilterChange) {
      // Extract chapter number for filtering
      let chapterNumber: string | undefined;
      if (chapter !== "All Chapters") {
        const match = chapter.match(/Chapter (\d+)/);
        chapterNumber = match ? match[1] : undefined;
      }
      
      onFilterChange({
        chapter: chapterNumber,
        module: selectedModule === "All Modules" ? undefined : selectedModule
      });
    }
  };

  const handleModuleFilter = (module: string) => {
    setSelectedModule(module);
    setIsModuleDropdownOpen(false);
    
    if (onFilterChange) {
      // Extract chapter number for current chapter selection
      let chapterNumber: string | undefined;
      if (selectedChapter !== "All Chapters") {
        const match = selectedChapter.match(/Chapter (\d+)/);
        chapterNumber = match ? match[1] : undefined;
      }
      
      onFilterChange({
        chapter: chapterNumber,
        module: module === "All Modules" ? undefined : module
      });
    }
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
    <header className={`border-b px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm transition-all duration-300 ${
      isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center gap-2 sm:gap-4">
        <DropdownMenu open={isNavDropdownOpen} onOpenChange={setIsNavDropdownOpen}>
          <DropdownMenuTrigger className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Navigation className={`h-5 w-5 ${
              isDarkMode ? 'text-green-400' : 'text-blue-500'
            }`} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-2 z-50">
            <ScrollArea className="h-auto max-h-[300px]">
              {pages.map((page, index) => (
                <DropdownMenuItem 
                  key={index}
                  className="cursor-pointer py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm transition-colors"
                  onClick={() => handleNavigation(page.path)}
                >
                  <span className={`font-source-sans ${isDarkMode ? 'text-green-300' : 'text-[#304455]'}`}>{page.name}</span>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        <h1 className={`text-lg sm:text-xl font-bold font-cursive ${isDarkMode ? 'text-green-300' : 'text-gray-800'}`}>
          Academic Arc
        </h1>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-green-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600" />
          )}
        </Button>

        {/* Notification Bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Bell className={`h-5 w-5 ${isDarkMode ? 'text-green-400' : 'text-gray-600'}`} />
              {hasNotifications && (
                <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-2 z-50">
            <div className="flex justify-between items-center mb-2 px-2">
              <h3 className={`font-semibold ${isDarkMode ? 'text-green-300' : 'text-gray-900'}`}>Notifications</h3>
              <Button variant="ghost" size="sm" className={`text-xs ${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-blue-500 hover:text-blue-700'}`}>
                Mark all as read
              </Button>
            </div>
            <DropdownMenuSeparator />
            <ScrollArea className="h-64">
              <div className="p-2 text-sm bg-blue-50 dark:bg-gray-700 rounded-md mb-2">
                <p className={`font-medium ${isDarkMode ? 'text-green-300' : 'text-gray-900'}`}>New chapter available!</p>
                <p className={`${isDarkMode ? 'text-green-400' : 'text-gray-600'}`}>Advanced Calculus chapter is now available.</p>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-green-500' : 'text-gray-500'}`}>2 hours ago</p>
              </div>
              <div className="p-2 text-sm mb-2">
                <p className={`font-medium ${isDarkMode ? 'text-green-300' : 'text-gray-900'}`}>Practice reminder</p>
                <p className={`${isDarkMode ? 'text-green-400' : 'text-gray-600'}`}>You haven't practiced in 2 days.</p>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-green-500' : 'text-gray-500'}`}>1 day ago</p>
              </div>
              <div className="p-2 text-sm mb-2">
                <p className={`font-medium ${isDarkMode ? 'text-green-300' : 'text-gray-900'}`}>Achievement unlocked!</p>
                <p className={`${isDarkMode ? 'text-green-400' : 'text-gray-600'}`}>You've completed 50 practice problems!</p>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-green-500' : 'text-gray-500'}`}>3 days ago</p>
              </div>
            </ScrollArea>
            <DropdownMenuSeparator />
            <Button variant="ghost" size="sm" className={`w-full text-center text-sm mt-1 ${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-gray-700'}`}>
              View all notifications
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Module Filter (renamed from Exam Filter) */}
        <DropdownMenu open={isModuleDropdownOpen} onOpenChange={setIsModuleDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden sm:flex"
            >
              <Filter className={`h-4 w-4 mr-1.5 ${isDarkMode ? 'text-green-400' : 'text-blue-500'}`} />
              <span className={`hidden md:inline ${isDarkMode ? 'text-green-300' : 'text-gray-700'}`}>{selectedModule}</span>
              <span className={`md:hidden ${isDarkMode ? 'text-green-300' : 'text-gray-700'}`}>Module</span>
              <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isModuleDropdownOpen ? "rotate-180" : ""} ${isDarkMode ? 'text-green-400' : 'text-gray-600'}`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-2 z-50">
            <ScrollArea className="h-[200px]">
              {modules.map((module) => (
                <DropdownMenuItem 
                  key={module}
                  className="cursor-pointer py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                  onClick={() => handleModuleFilter(module)}
                >
                  <span className={`font-source-sans text-sm ${isDarkMode ? 'text-green-300' : 'text-[#304455]'}`}>{module}</span>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Renamed Modules to Module - ModulesDialog component is used */}
        <ModulesDialog />

        {/* Chapters Dropdown */}
        <DropdownMenu open={isChapterDropdownOpen} onOpenChange={setIsChapterDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden lg:flex"
            >
              <Target className={`h-4 w-4 mr-1.5 ${isDarkMode ? 'text-green-400' : 'text-blue-500'}`} />
              <span className={isDarkMode ? 'text-green-300' : 'text-gray-700'}>
                {selectedChapter === "All Chapters" ? "Chapters" : selectedChapter.split(":")[0]}
              </span>
              <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isChapterDropdownOpen ? "rotate-180" : ""} ${isDarkMode ? 'text-green-400' : 'text-gray-600'}`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-2 z-50">
            <ScrollArea className="h-[300px]">
              {chapters.map((chapter, index) => (
                <DropdownMenuItem 
                  key={index}
                  className="cursor-pointer py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                  onClick={() => handleChapterFilter(chapter)}
                >
                  <span className={`font-source-sans text-sm ${isDarkMode ? 'text-green-300' : 'text-[#304455]'}`}>{chapter}</span>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenObjective}
          className="rounded-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Target className={`h-4 w-4 mr-1.5 ${isDarkMode ? 'text-green-400' : 'text-blue-500'}`} />
          <span className={isDarkMode ? 'text-green-300' : 'text-gray-700'}>Set Objectives</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenMode}
          className={`rounded-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${mode !== "manual" ? "text-emerald-500" : ""}`}
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
            className={`h-4 w-4 mr-1.5 ${isDarkMode ? 'text-green-400' : 'text-gray-600'}`}
          >
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span className={isDarkMode ? 'text-green-300' : 'text-gray-700'}>
            {mode === "manual" ? "Manual" : mode.charAt(0).toUpperCase() + mode.slice(1)}
          </span>
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
            <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md p-1 z-50">
              <DropdownMenuItem 
                className="cursor-pointer py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm transition-colors flex items-center text-red-500"
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
