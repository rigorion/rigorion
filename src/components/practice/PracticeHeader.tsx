import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target, Navigation, ChevronDown, LogOut, Bell, Filter, Moon, Sun, BookOpen } from "lucide-react";
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
import { useTheme } from "@/contexts/ThemeContext";

interface PracticeHeaderProps {
  onToggleSidebar: () => void;
  onOpenObjective: () => void;
  onOpenMode: () => void;
  mode: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onFilterChange?: (filters: { chapter?: string; module?: string; exam?: number | null }) => void;
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
  const [isExamDropdownOpen, setIsExamDropdownOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState<string>("All Chapters");
  const [selectedModule, setSelectedModule] = useState<string>("All SAT Math");
  const [selectedExam, setSelectedExam] = useState<number | null>(null);

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

  const exams = [
    "All Exams",
    "Exam 1",
    "Exam 2",
    "Exam 3",
    "Exam 4",
    "Exam 5",
    "Exam 6",
    "Exam 7",
    "Exam 8",
    "Exam 9",
    "Exam 10",
    "Exam 11",
    "Exam 12"
  ];

  const modules = [
    "All SAT Math",
    "SAT Reading",
    "SAT Writing"
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };

  const handleChapterFilter = (chapter: string) => {
    console.log("PracticeHeader - Chapter filter selected:", chapter);
    setSelectedChapter(chapter);
    setIsChapterDropdownOpen(false);
    
    if (onFilterChange) {
      let chapterNumber: string | undefined;
      if (chapter !== "All Chapters") {
        const match = chapter.match(/Chapter (\d+)/);
        chapterNumber = match ? match[1] : undefined;
      }
      
      onFilterChange({
        chapter: chapterNumber,
        module: selectedModule === "All SAT Math" ? undefined : selectedModule,
        exam: selectedExam
      });
    }
  };

  const handleModuleFilter = (module: string) => {
    console.log("PracticeHeader - Module filter selected:", module);
    setSelectedModule(module);
    setIsModuleDropdownOpen(false);
    
    if (onFilterChange) {
      let chapterNumber: string | undefined;
      if (selectedChapter !== "All Chapters") {
        const match = selectedChapter.match(/Chapter (\d+)/);
        chapterNumber = match ? match[1] : undefined;
      }
      
      onFilterChange({
        chapter: chapterNumber,
        module: module === "All SAT Math" ? undefined : module,
        exam: selectedExam
      });
    }
  };

  const handleExamFilter = (exam: string) => {
    console.log("PracticeHeader - Exam filter selected:", exam);
    setIsExamDropdownOpen(false);
    
    if (onFilterChange) {
      let examNumber: number | null = null;
      if (exam !== "All Exams") {
        const match = exam.match(/Exam (\d+)/);
        examNumber = match ? parseInt(match[1]) : null;
      }

      // Get current chapter and module values
      let chapterNumber: string | undefined;
      if (selectedChapter !== "All Chapters") {
        const match = selectedChapter.match(/Chapter (\d+)/);
        chapterNumber = match ? match[1] : undefined;
      }
      
      const moduleValue = selectedModule === "All SAT Math" ? undefined : selectedModule;
      
      setSelectedExam(examNumber);
      
      onFilterChange({
        chapter: chapterNumber,
        module: moduleValue,
        exam: examNumber
      });
    }
  };

  const handleClearAllFilters = () => {
    console.log("PracticeHeader - Clearing all filters");
    setSelectedChapter("All Chapters");
    setSelectedModule("All SAT Math");
    setSelectedExam(null);
    
    if (onFilterChange) {
      onFilterChange({
        chapter: undefined,
        module: undefined,
        exam: null
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

  const getActiveFilterText = () => {
    if (selectedExam !== null) {
      return `Exam ${selectedExam}`;
    }
    
    const filters = [];
    if (selectedChapter !== "All Chapters") {
      filters.push(selectedChapter);
    }
    if (selectedModule !== "All SAT Math") {
      filters.push(selectedModule);
    }
    
    return filters.length > 0 ? filters.join(" • ") : "All Questions";
  };

  const hasActiveFilters = () => {
    return selectedExam !== null || selectedChapter !== "All Chapters" || selectedModule !== "All SAT Math";
  };

  return (
    <header className={`border-b px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm transition-all duration-300 ${
      isDarkMode ? 'bg-gray-900 border-green-500/30' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center gap-2 sm:gap-4">
        <DropdownMenu open={isNavDropdownOpen} onOpenChange={setIsNavDropdownOpen}>
          <DropdownMenuTrigger className={`rounded-lg p-2 transition-colors ${
            isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}>
            <Navigation className={`h-5 w-5 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className={`w-56 shadow-lg rounded-lg p-2 z-50 ${
            isDarkMode ? 'bg-gray-900 border-green-500/30' : 'bg-white border-gray-200'
          }`}>
            <ScrollArea className="h-auto max-h-[300px]">
              {pages.map((page, index) => (
                <DropdownMenuItem 
                  key={index}
                  className={`cursor-pointer py-2 rounded-sm transition-colors ${
                    isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleNavigation(page.path)}
                >
                  <span className={`font-source-sans ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{page.name}</span>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        <h1 className={`text-lg sm:text-xl font-bold font-cursive ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Academic Arc
        </h1>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className={`rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-green-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-500" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`relative rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              <Bell className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              {hasNotifications && (
                <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={`w-80 shadow-lg rounded-lg p-2 z-50 ${
            isDarkMode ? 'bg-gray-900 border-green-500/30' : 'bg-white border-gray-200'
          }`}>
            <div className="flex justify-between items-center mb-2 px-2">
              <h3 className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Notifications</h3>
              <Button variant="ghost" size="sm" className={`text-xs ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
                Mark all as read
              </Button>
            </div>
            <DropdownMenuSeparator className={isDarkMode ? 'bg-green-500/30' : ''} />
            <ScrollArea className="h-64">
              <div className={`p-2 text-sm rounded-md mb-2 ${
                isDarkMode ? 'bg-gray-800' : 'bg-blue-50'
              }`}>
                <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>New chapter available!</p>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Advanced Calculus chapter is now available.</p>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>2 hours ago</p>
              </div>
            </ScrollArea>
            <DropdownMenuSeparator className={isDarkMode ? 'bg-green-500/30' : ''} />
            <Button variant="ghost" size="sm" className={`w-full text-center text-sm mt-1 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600'}`}>
              View all notifications
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active Filter Display */}
        <div className={`hidden sm:flex items-center px-3 py-1 rounded-full text-xs transition-all ${
          hasActiveFilters()
            ? (isDarkMode ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-blue-50 text-blue-700 border border-blue-200')
            : (isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600')
        }`}>
          <Filter className="h-3 w-3 mr-1" />
          <span className="max-w-32 truncate">{getActiveFilterText()}</span>
          {hasActiveFilters() && (
            <button
              onClick={handleClearAllFilters}
              className={`ml-2 hover:bg-opacity-75 rounded-full p-0.5 transition-colors ${
                isDarkMode ? 'hover:bg-green-700' : 'hover:bg-blue-200'
              }`}
              title="Clear all filters"
            >
              ×
            </button>
          )}
        </div>

        {/* Module Filter - Make visible on all screen sizes */}
        <DropdownMenu open={isModuleDropdownOpen} onOpenChange={setIsModuleDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full bg-transparent transition-colors flex ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              } ${selectedModule !== "All SAT Math" ? (isDarkMode ? 'text-green-300 bg-green-900/20' : 'text-blue-600 bg-blue-50') : ''}`}
            >
              <Filter className={`h-4 w-4 mr-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`hidden sm:inline ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {selectedModule.replace("SAT ", "")}
              </span>
              <span className={`sm:hidden ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Module</span>
              <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isModuleDropdownOpen ? "rotate-180" : ""} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={`w-56 shadow-lg rounded-lg p-2 z-50 ${
            isDarkMode ? 'bg-gray-900 border-green-500/30' : 'bg-white border-gray-200'
          }`}>
            <ScrollArea className="h-[150px]">
              {modules.map((module) => (
                <DropdownMenuItem 
                  key={module}
                  className={`cursor-pointer py-2 px-3 rounded-md transition-colors ${
                    isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                  } ${selectedModule === module ? (isDarkMode ? 'bg-gray-800' : 'bg-gray-100') : ''}`}
                  onClick={() => handleModuleFilter(module)}
                >
                  <span className={`font-source-sans text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{module}</span>
                  {selectedModule === module && <span className="ml-auto text-xs">✓</span>}
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Exams Filter - Make visible on all screen sizes */}
        <DropdownMenu open={isExamDropdownOpen} onOpenChange={setIsExamDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full bg-transparent transition-colors flex ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              } ${selectedExam !== null ? (isDarkMode ? 'text-green-300 bg-green-900/20' : 'text-blue-600 bg-blue-50') : ''}`}
            >
              <BookOpen className={`h-4 w-4 mr-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`hidden sm:inline ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {selectedExam !== null ? `Exam ${selectedExam}` : "Exams"}
              </span>
              <span className={`sm:hidden ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Ex</span>
              <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isExamDropdownOpen ? "rotate-180" : ""} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={`w-56 shadow-lg rounded-lg p-2 z-50 ${
            isDarkMode ? 'bg-gray-900 border-green-500/30' : 'bg-white border-gray-200'
          }`}>
            <ScrollArea className="h-[300px]">
              {exams.map((exam, index) => (
                <DropdownMenuItem 
                  key={index}
                  className={`cursor-pointer py-2 px-3 rounded-md transition-colors ${
                    isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                  } ${(selectedExam === null && exam === "All Exams") || (selectedExam !== null && exam === `Exam ${selectedExam}`) ? (isDarkMode ? 'bg-gray-800' : 'bg-gray-100') : ''}`}
                  onClick={() => handleExamFilter(exam)}
                >
                  <span className={`font-source-sans text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{exam}</span>
                  {((selectedExam === null && exam === "All Exams") || (selectedExam !== null && exam === `Exam ${selectedExam}`)) && <span className="ml-auto text-xs">✓</span>}
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Chapters Filter - Make visible on all screen sizes */}
        <DropdownMenu open={isChapterDropdownOpen} onOpenChange={setIsChapterDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full bg-transparent transition-colors flex ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              } ${selectedChapter !== "All Chapters" ? (isDarkMode ? 'text-green-300 bg-green-900/20' : 'text-blue-600 bg-blue-50') : ''}`}
            >
              <Target className={`h-4 w-4 mr-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`hidden sm:inline ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {selectedChapter === "All Chapters" ? "Chapters" : selectedChapter.split(":")[0]}
              </span>
              <span className={`sm:hidden ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Ch</span>
              <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isChapterDropdownOpen ? "rotate-180" : ""} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={`w-64 shadow-lg rounded-lg p-2 z-50 ${
            isDarkMode ? 'bg-gray-900 border-green-500/30' : 'bg-white border-gray-200'
          }`}>
            <ScrollArea className="h-[300px]">
              {chapters.map((chapter, index) => (
                <DropdownMenuItem 
                  key={index}
                  className={`cursor-pointer py-2 px-3 rounded-md transition-colors ${
                    isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                  } ${selectedChapter === chapter ? (isDarkMode ? 'bg-gray-800' : 'bg-gray-100') : ''}`}
                  onClick={() => handleChapterFilter(chapter)}
                >
                  <span className={`font-source-sans text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{chapter}</span>
                  {selectedChapter === chapter && <span className="ml-auto text-xs">✓</span>}
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenObjective}
          className={`rounded-full bg-transparent transition-colors ${
            isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
        >
          <Target className={`h-4 w-4 mr-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Set Objectives</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenMode}
          className={`rounded-full bg-transparent transition-colors ${mode !== "manual" ? "text-emerald-500" : ""} ${
            isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
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
            className={`h-4 w-4 mr-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            {mode === "manual" ? "Manual" : mode.charAt(0).toUpperCase() + mode.slice(1)}
          </span>
        </Button>

        <div className="ml-2 flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className={`h-8 w-8 cursor-pointer transition-all ${
                isDarkMode ? 'hover:ring-2 hover:ring-green-400' : 'hover:ring-2 hover:ring-blue-200'
              }`}>
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className={`text-xs ${
                  isDarkMode ? 'bg-green-600 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`w-48 shadow-lg rounded-md p-1 z-50 ${
              isDarkMode ? 'bg-gray-900 border-green-500/30' : 'bg-white border-gray-200'
            }`}>
              <DropdownMenuItem 
                className={`cursor-pointer py-2 rounded-sm transition-colors flex items-center text-red-500 ${
                  isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
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
