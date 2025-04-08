
import { Button } from "@/components/ui/button";
import { BookMarked, Menu, Palette, Target } from "lucide-react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";

interface PracticeHeaderProps {
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  onOpenObjective: () => void;
  onOpenMode: () => void;
  mode: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const PracticeHeader = ({ 
  onToggleSidebar, 
  onOpenSettings, 
  onOpenObjective, 
  onOpenMode, 
  mode,
  sidebarOpen,
  setSidebarOpen
}: PracticeHeaderProps) => {
  return (
    <header className="border-b px-6 py-4 flex items-center justify-between bg-gray-50">
      <div className="flex items-center gap-4">
        <Collapsible open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <CollapsibleTrigger className="rounded-lg p-2 hover:bg-gray-100">
            <BookMarked className="h-5 w-5 text-blue-500" />
          </CollapsibleTrigger>
        </Collapsible>
        <h1
          className="text-xl font-bold text-gray-800"
          style={{ fontFamily: '"Dancing Script", cursive' }}
        >
          Academic Arc
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenSettings}
          className="rounded-full"
        >
          <Palette className="h-4 w-4 mr-1.5" />
          Display
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenObjective}
          className="rounded-full text-gray-500"
        >
          <Target className="h-4 w-4 mr-1.5 text-blue-500" />
          Chapter
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenObjective}
          className="rounded-full text-gray-500"
        >
          <Target className="h-4 w-4 mr-1.5 text-blue-500" />
          Set Objectives
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenMode}
          className={`rounded-full ${mode !== "manual" ? "text-emerald-500" : ""}`}
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
      </div>
    </header>
  );
};

export default PracticeHeader;
