import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Calendar, Settings, ChevronDown, BarChart3, Clock, Gauge, Target } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { TimePeriod } from "@/types/progress";

type VisibleSections = {
  totalProgress: boolean;
  performanceGraph: boolean;
  difficultyStats: boolean;
  chapterProgress: boolean;
  timeManagement: boolean;
  goals: boolean;
};

interface ProgressNavigationProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setPeriod: (period: TimePeriod) => void;
  visibleSections: VisibleSections;
  setVisibleSections: (sections: Record<string, boolean>) => void;
}

export const ProgressNavigation: React.FC<ProgressNavigationProps> = ({
  sidebarOpen,
  setSidebarOpen,
  setPeriod,
  visibleSections,
  setVisibleSections
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fixed toggle handler for sections
  const handleSectionToggle = (section: keyof VisibleSections, checked: boolean) => {
    const update = { [section]: checked };
    setVisibleSections(update);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden hover:bg-white/10 transition-colors"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </Button>
        <span className="font-medium text-lg hidden md:inline-block">Progress</span>
      </div>

      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-white hover:bg-gray-50 transition-all shadow-sm">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Sections</span>
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-sm border border-gray-100 shadow-lg" align="end">
            <DropdownMenuCheckboxItem
              checked={visibleSections.totalProgress}
              disabled={true} // Always visible
              onCheckedChange={() => {}} // No-op
              className="opacity-50 cursor-not-allowed"
            >
              <Gauge className="mr-2 h-4 w-4" />
              Total Progress
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem
              checked={visibleSections.performanceGraph}
              onCheckedChange={(checked) => handleSectionToggle('performanceGraph', checked)}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Performance Graph
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem
              checked={visibleSections.difficultyStats}
              onCheckedChange={(checked) => handleSectionToggle('difficultyStats', checked)}
            >
              <Target className="mr-2 h-4 w-4" />
              Difficulty Stats
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem
              checked={visibleSections.chapterProgress}
              onCheckedChange={(checked) => handleSectionToggle('chapterProgress', checked)}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Chapter Progress
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem
              checked={visibleSections.timeManagement}
              onCheckedChange={(checked) => handleSectionToggle('timeManagement', checked)}
            >
              <Clock className="mr-2 h-4 w-4" />
              Time Management
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem
              checked={visibleSections.goals}
              onCheckedChange={(checked) => handleSectionToggle('goals', checked)}
            >
              <Target className="mr-2 h-4 w-4" />
              Goals
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-white hover:bg-gray-50 transition-all shadow-sm">
              <Calendar className="h-4 w-4" />
              <span>Time Period</span>
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm border border-gray-100 shadow-lg">
            <DropdownMenuItem onClick={() => setPeriod("daily")}>
              Daily
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPeriod("weekly")}>
              Weekly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPeriod("monthly")}>
              Monthly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPeriod("yearly")}>
              Yearly
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="ghost" 
          size="icon"
          className="hover:bg-gray-50 transition-colors"
        >
          <Settings className="h-5 w-5 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};

export default ProgressNavigation;
