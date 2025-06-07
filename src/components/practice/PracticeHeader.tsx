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
  onFilterChange?: (filters: { 
    chapter?: string; 
    module?: string; 
    course?: string;
    examNumber?: string; 
  }) => void;
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
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [isExamDropdownOpen, setIsExamDropdownOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState<string>("All Chapters");
  const [selectedModule, setSelectedModule] = useState<string>("All Modules");
  const [selectedCourse, setSelectedCourse] = useState<string>("All Courses");
  const [selectedExam, setSelectedExam] = useState<string>("All Exams");

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
    "SAT Math",
    "SAT Reading",
    "SAT Writing"
  ];

  const courses = [
    "All Courses",
    "SAT Math",
    "SAT Reading", 
    "SAT Writing"
  ];

  const exams = [
    "All Exams",
    "Exam 1",
    "Exam 2",
    "Exam 3",
    "Exam 4",
    "Exam 5"
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
      let chapterNumber: string | undefined;
      if (chapter !== "All Chapters") {
        const match = chapter.match(/Chapter (\d+)/);
        chapterNumber = match ? match[1] : undefined;
      }
      
      onFilterChange({
        chapter: chapterNumber
      });
    }
  };

  const handleModuleFilter = (module: string) => {
    setSelectedModule(module);
    setIsModuleDropdownOpen(false);
    
    if (onFilterChange) {
      onFilterChange({
        module: module === "All Modules" ? undefined : module
      });
    }
  };

  const handleCourseFilter = (course: string) => {
    setSelectedCourse(course);
    setIsCourseDropdownOpen(false);
    
    if (onFilterChange) {
      onFilterChange({
        course: course === "All Courses" ? undefined : course
      });
    }
  };

  const handleExamFilter = (exam: string) => {
    setSelectedExam(exam);
    setIsExamDropdownOpen(false);
    
    if (onFilterChange) {
      let examNumber: string | undefined;
      if (exam !== "All Exams") {
        const match = exam.match(/Exam (\d+)/);
        examNumber = match ? match[1] : undefined;
      }
      
      onFilterChange({
        examNumber: examNumber
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
      isDarkMode ? 'bg-gray-900 border-green-500/30' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center gap-2 sm:gap-4">
        <DropdownMenu open={isNavDropdownOpen} onOpenChange={setIsNavDropdownOpen}>
          <DropdownMenuTrigger className={`rounded-lg p-2 transition-colors ${
            isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}>
            <Navigation className={`h-5 w-5 ${
              isDarkMode ? 'text-green-400' : 'text-blue-500'
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
                  <span className={`font-source-sans ${isDarkMode ? 'text-green-400' : 'text-[#304455]'}`}>{page.name}</span>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        <h1 className={`text-lg sm:text-xl font-bold font-cursive ${isDarkMode ? 'text-green-400' : 'text-gray-800'}`}>
          Academic Arc
        </h1>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className={`rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
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
              className={`relative rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              <Bell className={`h-5 w-5 ${isDarkMode ? 'text-green-400' : 'text-gray-600'}`} />
              {hasNotifications && (
                <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={`w-80 shadow-lg rounded-lg p-2 z-50 ${
            isDarkMode ? 'bg-gray-900 border-green-500/30' : 'bg-white border-gray-200'
          }`}>
            <div className="flex justify-between items-center mb-2 px-2">
              <h3 className={`font-semibold ${isDarkMode ? 'text-green-400' : 'text-gray-900'}`}>Notifications</h3>
              <Button variant="ghost" size="sm" className={`text-xs ${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-blue-500 hover:text-blue-700'}`}>
                Mark all as read
              </Button>
            </div>
            <DropdownMenuSeparator className={isDarkMode ? 'bg-green-500/30' : ''} />
            <ScrollArea className="h-64">
              <div className={`p-2 text-sm rounded-md mb-2 ${
                isDarkMode ? 'bg-gray-800' : 'bg-blue-50'
              }`}>
                <p className={`font-medium ${isDarkMode ? 'text-green-400' : 'text-gray-900'}`}>New chapter available!</p>
                <p className={`${isDarkMode ? 'text-green-500' : 'text-gray-600'}`}>Advanced Calculus chapter is now available.</p>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-green-600' : 'text-gray-500'}`}>2 hours ago</p>
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
            <DropdownMenuSeparator className={isDarkMode ? 'bg-green-500/30' : ''} />
            <Button variant="ghost" size="sm" className={`w-full text-center text-sm mt-1 ${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-gray-700'}`}>
              View all notifications
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Course Filter */}
        <DropdownMenu open={isCourseDropdownOpen} onOpenChange={setIsCourseDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full bg-transparent transition-colors hidden md:flex ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <Filter className={`h-4 w-4 mr-1.5 ${isDarkMode ? 'text-green-400' : 'text-blue-500'}`} />
              <span className={`hidden lg:inline ${isDarkMode ? 'text-green-400' : 'text-gray-700'}`}>
                {selectedCourse === "All Courses" ? "Course" : selectedCourse}
              </span>
              <span className={`lg:hidden ${isDarkMode ? 'text-green-400' : 'text-gray-700'}`}>Course</span>
              <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isCourseDropdownOpen ? "rotate-180" : ""} ${isDarkMode ? 'text-green-400' : 'text-gray-600'}`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={`w-56 shadow-lg rounded-lg p-2 z-50 ${
            isDarkMode ? 'bg-gray-900 border-green-500/30' : 'bg-white border-gray-200'
          }`}>
            <ScrollArea className="h-[150px]">
              {courses.map((course) => (
                <DropdownMenuItem 
                  key={course}
                  className={`cursor-pointer py-2 px-3 rounded-md transition-colors ${
                    isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleCourseFilter(course)}
                >
                  <span className={`font-source-sans text-sm ${isDarkMode ? 'text-green-400' : 'text-[#304455]'}`}>{course}</span>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Module Filter */}
        <DropdownMenu open={isModuleDropdownOpen} onOpenChange={setIsModuleDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full bg-transparent transition-colors hidden sm:flex ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <Filter className={`h-4 w-4 mr-1.5 ${isDarkMode ? 'text-green-400' : 'text-blue-500'}`} />
              <span className={`hidden md:inline ${isDarkMode ? 'text-green-400' : 'text-gray-700'}`}>
                {selectedModule === "All Modules" ? "Module" : selectedModule}
              </span>
              <span className={`md:hidden ${isDarkMode ? 'text-green-400' : 'text-gray-700'}`}>Module</span>
              <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isModuleDropdownOpen ? "rotate-180" : ""} ${isDarkMode ? 'text-green-400' : 'text-gray-600'}`} />
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
                  }`}
                  onClick={() => handleModuleFilter(module)}
                >
                  <span className={`font-source-sans text-sm ${isDarkMode ? 'text-green-400' : 'text-[#304455]'}`}>{module}</span>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Exams Dialog - Using ModulesDialog but for exam filtering */}
        <DropdownMenu open={isExamDropdownOpen} onOpenChange={setIsExamDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full bg-transparent transition-colors ${
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
                className={`h-4 w-4 mr-1.5 ${isDarkMode ? 'text-green-400' : 'text-blue-500'}`}
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
              </svg>
              <span className={isDarkMode ? 'text-green-400' : 'text-gray-700'}>
                {selectedExam === "All Exams" ? "Exams" : selectedExam}
              </span>
              <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isExamDropdownOpen ? "rotate-180" : ""} ${isDarkMode ? 'text-green-400' : 'text-gray-600'}`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={`w-56 shadow-lg rounded-lg p-2 z-50 ${
            isDarkMode ? 'bg-gray-900 border-green-500/30' : 'bg-white border-gray-200'
          }`}>
            <ScrollArea className="h-[150px]">
              {exams.map((exam) => (
                <DropdownMenuItem 
                  key={exam}
                  className={`cursor-pointer py-2 px-3 rounded-md transition-colors ${
                    isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleExamFilter(exam)}
                >
                  <span className={`font-source-sans text-sm ${isDarkMode ? 'text-green-400' : 'text-[#304455]'}`}>{exam}</span>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Chapters Dropdown */}
        <DropdownMenu open={isChapterDropdownOpen} onOpenChange={setIsChapterDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full bg-transparent transition-colors hidden lg:flex ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <Target className={`h-4 w-4 mr-1.5 ${isDarkMode ? 'text-green-400' : 'text-blue-500'}`} />
              <span className={isDarkMode ? 'text-green-400' : 'text-gray-700'}>
                {selectedChapter === "All Chapters" ? "Chapters" : selectedChapter.split(":")[0]}
              </span>
              <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isChapterDropdownOpen ? "rotate-180" : ""} ${isDarkMode ? 'text-green-400' : 'text-gray-600'}`} />
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
                  }`}
                  onClick={() => handleChapterFilter(chapter)}
                >
                  <span className={`font-source-sans text-sm ${isDarkMode ? 'text-green-400' : 'text-[#304455]'}`}>{chapter}</span>
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
          <Target className={`h-4 w-4 mr-1.5 ${isDarkMode ? 'text-green-400' : 'text-blue-500'}`} />
          <span className={isDarkMode ? 'text-green-400' : 'text-gray-700'}>Set Objectives</span>
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
            className={`h-4 w-4 mr-1.5 ${isDarkMode ? 'text-green-400' : 'text-gray-600'}`}
          >
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span className={isDarkMode ? 'text-green-400' : 'text-gray-700'}>
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
