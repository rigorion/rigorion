
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target, Navigation, ChevronDown, LogOut, Bell, Filter } from "lucide-react";
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
  onFilterChange?: (filters: { chapter?: string; examNumber?: number }) => void;
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
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);
  const [isExamDropdownOpen, setIsExamDropdownOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState<string>("All Chapters");
  const [selectedExam, setSelectedExam] = useState<number | string>("All Exams");

  const pages = [
    { name: "Home", path: "/" },
    { name: "Practice", path: "/practice" },
    { name: "Progress", path: "/progress" },
    { name: "Chat", path: "/chat" },
    { name: "About", path: "/about" },
  ];

  const chapters = [
    "All Chapters",
    "Chapter 1: Introduction to Mathematics",
    "Chapter 2: Basic Algebra", 
    "Chapter 3: Geometry Fundamentals",
    "Chapter 4: Probability & Statistics",
    "Chapter 5: Advanced Functions"
  ];

  const exams = [
    { id: "all", name: "All Exams" },
    { id: 1, name: "Exam 1: Foundation" },
    { id: 2, name: "Exam 2: Intermediate" },
    { id: 3, name: "Exam 3: Advanced" },
    { id: 4, name: "Exam 4: Final Assessment" }
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
      onFilterChange({
        chapter: chapter === "All Chapters" ? undefined : chapter,
        examNumber: selectedExam === "All Exams" ? undefined : Number(selectedExam)
      });
    }
  };

  const handleExamFilter = (examId: number | string) => {
    setSelectedExam(examId);
    setIsExamDropdownOpen(false);
    
    if (onFilterChange) {
      onFilterChange({
        chapter: selectedChapter === "All Chapters" ? undefined : selectedChapter,
        examNumber: examId === "All Exams" ? undefined : Number(examId)
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
        <h1 className="text-xl font-bold text-gray-800 font-cursive">
          Academic Arc
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-gray-100"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {hasNotifications && (
                <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-white border border-gray-200 shadow-lg rounded-lg p-2">
            <div className="flex justify-between items-center mb-2 px-2">
              <h3 className="font-semibold">Notifications</h3>
              <Button variant="ghost" size="sm" className="text-xs text-blue-500 hover:text-blue-700">
                Mark all as read
              </Button>
            </div>
            <DropdownMenuSeparator />
            <ScrollArea className="h-64">
              <div className="p-2 text-sm bg-blue-50 rounded-md mb-2">
                <p className="font-medium">New chapter available!</p>
                <p className="text-gray-600">Advanced Calculus chapter is now available.</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
              <div className="p-2 text-sm mb-2">
                <p className="font-medium">Practice reminder</p>
                <p className="text-gray-600">You haven't practiced in 2 days.</p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
              <div className="p-2 text-sm mb-2">
                <p className="font-medium">Achievement unlocked!</p>
                <p className="text-gray-600">You've completed 50 practice problems!</p>
                <p className="text-xs text-gray-500 mt-1">3 days ago</p>
              </div>
            </ScrollArea>
            <DropdownMenuSeparator />
            <Button variant="ghost" size="sm" className="w-full text-center text-sm mt-1">
              View all notifications
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Exam Filter */}
        <DropdownMenu open={isExamDropdownOpen} onOpenChange={setIsExamDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full bg-transparent hover:bg-gray-100 transition-colors"
            >
              <Filter className="h-4 w-4 mr-1.5 text-blue-500" />
              {typeof selectedExam === 'string' ? selectedExam : `Exam ${selectedExam}`}
              <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isExamDropdownOpen ? "rotate-180" : ""}`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg rounded-lg p-2">
            <ScrollArea className="h-[200px]">
              {exams.map((exam) => (
                <DropdownMenuItem 
                  key={exam.id}
                  className="cursor-pointer py-2 px-3 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => handleExamFilter(exam.id)}
                >
                  <span className="font-source-sans text-[#304455] text-sm">{exam.name}</span>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

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
              {selectedChapter === "All Chapters" ? "Chapters" : selectedChapter.split(":")[0]}
              <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isChapterDropdownOpen ? "rotate-180" : ""}`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-lg rounded-lg p-2">
            <ScrollArea className="h-[300px]">
              {chapters.map((chapter, index) => (
                <DropdownMenuItem 
                  key={index}
                  className="cursor-pointer py-2 px-3 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => handleChapterFilter(chapter)}
                >
                  <span className="font-source-sans text-[#304455] text-sm">{chapter}</span>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        
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
