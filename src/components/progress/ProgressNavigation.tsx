
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, Calendar, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TimePeriod } from "@/types/progress";

interface ProgressNavigationProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setPeriod: (period: TimePeriod) => void;
}

export const ProgressNavigation: React.FC<ProgressNavigationProps> = ({
  sidebarOpen,
  setSidebarOpen,
  setPeriod
}) => {
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
              <Calendar className="h-4 w-4" />
              <span>Time Period</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
