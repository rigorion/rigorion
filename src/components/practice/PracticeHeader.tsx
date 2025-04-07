import { Button } from "@/components/ui/button";
import { Book, Target, Brain, Menu, ArrowUp, Timer, Clock, Hand, BookOpen, Zap } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ModeDialog from "./ModeDialog";
import { useState } from "react";

interface PracticeHeaderProps {
  onOpenObjective: () => void;
  onOpenMode: () => void;
  onToggleSidebar: () => void;
  selectedChapter: string;
  setSelectedChapter: (chapter: string) => void;
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
  totalQuestions: number;
  currentQuestion: number;
}

export const PracticeHeader = ({
  onOpenObjective,
  onOpenMode,
  onToggleSidebar,
  selectedChapter,
  setSelectedChapter,
  selectedMode,
  setSelectedMode,
  totalQuestions,
  currentQuestion
}: PracticeHeaderProps) => {
  const [showModeDialog, setShowModeDialog] = useState(false);
  // Updated chapters list including all five chapters
  const chapters = ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5"];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleSidebar}
            className="shadow-sm shadow-gray-200"
          >
            <Menu className="h-5 w-5 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text" />
          </Button>
          <h1 className="font-cursive text-2xl gradient-text">
            Academic Arc
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Chapter Selection Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-full shadow-sm shadow-gray-200"
              >
                <Book className="h-4 w-4 mr-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text" />
                {selectedChapter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {chapters.map((chapter) => (
                <DropdownMenuItem 
                  key={chapter}
                  onClick={() => setSelectedChapter(chapter)}
                >
                  {chapter}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenObjective}
            className="h-8 rounded-full shadow-sm shadow-gray-200"
          >
            <Target className="h-4 w-4 mr-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text" />
            Set Objectives
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowModeDialog(true)}
            className="h-8 rounded-full shadow-sm shadow-gray-200"
          >
            <Brain className="h-4 w-4 mr-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text" />
            {selectedMode}
          </Button>

          <div className="flex items-center gap-1 border rounded-full px-3 py-1 text-sm shadow-sm shadow-gray-200">
            <span>Rank: #1</span>
            <ArrowUp className="h-4 w-4 text-green-500" />
          </div>
        </div>
      </div>

      <ModeDialog
        open={showModeDialog}
        onOpenChange={setShowModeDialog}
        onSetMode={setSelectedMode}
      />
    </header>
  );
};
