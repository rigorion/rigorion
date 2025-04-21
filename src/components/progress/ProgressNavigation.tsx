
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Calendar, Settings, ChevronDown, BarChart3, Clock, Gauge, Target } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { TimePeriod } from "@/types/progress";

interface ProgressNavigationProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setPeriod: (period: TimePeriod) => void;
  visibleSections?: Record<string, boolean>;
  setVisibleSections?: (sections: Record<string, boolean>) => void;
}

export const ProgressNavigation: React.FC<ProgressNavigationProps> = ({
  sidebarOpen,
  setSidebarOpen,
  setPeriod,
  visibleSections = {
    totalProgress: true,
    performanceGraph: true,
    difficultyStats: true,
    chapterProgress: true,
    timeManagement: true,
    goals: true
  },
  setVisibleSections = () => {}
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="font-medium text-lg hidden md:inline-block">Progress</span>
      </div>

      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Sections</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white" align="end">
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
              onCheckedChange={(checked) => setVisibleSections({...visibleSections, performanceGraph: checked})}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Performance Graph
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem
              checked={visibleSections.difficultyStats}
              onCheckedChange={(checked) => setVisibleSections({...visibleSections, difficultyStats: checked})}
            >
              <Target className="mr-2 h-4 w-4" />
              Difficulty Stats
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem
              checked={visibleSections.chapterProgress}
              onCheckedChange={(checked) => setVisibleSections({...visibleSections, chapterProgress: checked})}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Chapter Progress
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem
              checked={visibleSections.timeManagement}
              onCheckedChange={(checked) => setVisibleSections({...visibleSections, timeManagement: checked})}
            >
              <Clock className="mr-2 h-4 w-4" />
              Time Management
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem
              checked={visibleSections.goals}
              onCheckedChange={(checked) => setVisibleSections({...visibleSections, goals: checked})}
            >
              <Target className="mr-2 h-4 w-4" />
              Goals
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span>Time Period</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
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

        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ProgressNavigation;
