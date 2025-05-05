
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
  fontFamily = 'inter',
  fontSize = 14,
  contentColor = '#374151',
  keyPhraseColor = '#2563eb',
  formulaColor = '#dc2626'
}: PracticeHeaderProps) => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);
  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);

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

  const fontOptions = [
    { value: 'inter', label: 'Inter' },
    { value: 'source-sans', label: 'Source Sans Pro' },
    { value: 'poppins', label: 'Poppins' },
    { value: 'merriweather', label: 'Merriweather' },
    { value: 'dancing-script', label: 'Dancing Script' }
  ];

  const fontSizeOptions = [
    { value: 12, label: 'Small' },
    { value: 14, label: 'Medium' },
    { value: 16, label: 'Large' },
    { value: 18, label: 'X-Large' }
  ];

  const colorOptions = [
    { value: '#374151', label: 'Dark Gray' },
    { value: '#1F2937', label: 'Charcoal' },
    { value: '#111827', label: 'Almost Black' },
    { value: '#304455', label: 'Vue Gray' }
  ];

  const highlightOptions = [
    { value: '#2563eb', label: 'Blue' },
    { value: '#059669', label: 'Green' },
    { value: '#7C3AED', label: 'Purple' },
    { value: '#42b883', label: 'Vue Green' }
  ];

  const formulaOptions = [
    { value: '#dc2626', label: 'Red' },
    { value: '#d97706', label: 'Orange' },
    { value: '#4f46e5', label: 'Indigo' },
    { value: '#7e69ab', label: 'Purple' }
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
                  {page.name}
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
        {/* Modules Dropdown */}
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
                  className="cursor-pointer py-2 hover:bg-gray-100 rounded-sm transition-colors"
                >
                  {chapter}
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Styling Dropdown */}
        {onUpdateStyle && (
          <DropdownMenu open={isStyleDropdownOpen} onOpenChange={setIsStyleDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-transparent hover:bg-gray-100 transition-colors"
              >
                <Palette className="h-4 w-4 mr-1.5 text-blue-500" />
                Styling
                <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isStyleDropdownOpen ? "rotate-180" : ""}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-lg rounded-lg p-2">
              <ScrollArea className="h-[320px]">
                <div className="space-y-3 px-1">
                  {/* Font Family */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 mb-1">FONT FAMILY</h4>
                    <div className="space-y-1">
                      {fontOptions.map(font => (
                        <div 
                          key={font.value} 
                          className={`px-2 py-1.5 rounded-md cursor-pointer text-sm ${fontFamily === font.value ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                          onClick={() => onUpdateStyle('fontFamily', font.value)}
                        >
                          <span className={`font-${font.value}`}>{font.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  {/* Font Size */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 mb-1">FONT SIZE</h4>
                    <div className="space-y-1">
                      {fontSizeOptions.map(size => (
                        <div 
                          key={size.value} 
                          className={`px-2 py-1.5 rounded-md cursor-pointer text-sm ${fontSize === size.value ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                          onClick={() => onUpdateStyle('fontSize', size.value)}
                        >
                          {size.label}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  {/* Content Color */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 mb-1">TEXT COLOR</h4>
                    <div className="space-y-1">
                      {colorOptions.map(color => (
                        <div 
                          key={color.value} 
                          className={`px-2 py-1.5 rounded-md cursor-pointer text-sm flex items-center ${contentColor === color.value ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                          onClick={() => onUpdateStyle('contentColor', color.value)}
                        >
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color.value }}></div>
                          {color.label}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  {/* Key Phrase Color */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 mb-1">HIGHLIGHT COLOR</h4>
                    <div className="space-y-1">
                      {highlightOptions.map(color => (
                        <div 
                          key={color.value} 
                          className={`px-2 py-1.5 rounded-md cursor-pointer text-sm flex items-center ${keyPhraseColor === color.value ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                          onClick={() => onUpdateStyle('keyPhraseColor', color.value)}
                        >
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color.value }}></div>
                          {color.label}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  {/* Formula Color */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 mb-1">FORMULA COLOR</h4>
                    <div className="space-y-1">
                      {formulaOptions.map(color => (
                        <div 
                          key={color.value} 
                          className={`px-2 py-1.5 rounded-md cursor-pointer text-sm flex items-center ${formulaColor === color.value ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                          onClick={() => onUpdateStyle('formulaColor', color.value)}
                        >
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color.value }}></div>
                          {color.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
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
