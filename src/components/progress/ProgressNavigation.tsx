import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Calendar, Settings, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  return <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden hover:bg-white/10 transition-colors">
          <Menu className="h-5 w-5 text-gray-600" />
        </Button>
        <span className="font-medium text-lg hidden md:inline-block">Progress</span>
      </div>

      <div className="flex items-center space-x-2">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-white hover:bg-gray-50 transition-all shadow-sm border-gray-100">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span>Time Period</span>
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border border-gray-100 shadow-sm">
            <DropdownMenuItem onClick={() => setPeriod("daily")} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
              Daily
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPeriod("weekly")} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
              Weekly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPeriod("monthly")} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
              Monthly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPeriod("yearly")} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
              Yearly
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        
      </div>
    </div>;
};
export default ProgressNavigation;