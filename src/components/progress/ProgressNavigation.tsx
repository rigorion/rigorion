
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
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  
  // Mock courses data for the dropdown
  const courses = [
    { id: "1", name: "SAT Preparation", active: true, daysRemaining: 25 },
    { id: "2", name: "GMAT Course", active: true, daysRemaining: 14 },
    { id: "3", name: "GRE Advanced", active: false, daysRemaining: 0 },
    { id: "4", name: "LSAT Fundamentals", active: false, daysRemaining: 0 }
  ];
  
  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden hover:bg-white/10 transition-colors">
          <Menu className="h-5 w-5 text-gray-600" />
        </Button>
        <span className="font-medium text-lg hidden md:inline-block">Progress</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Courses Dropdown */}
        <DropdownMenu open={isCourseDropdownOpen} onOpenChange={setIsCourseDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-white hover:bg-gray-50 transition-all shadow-sm border-gray-100">
              <span>Courses</span>
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border border-gray-100 shadow-sm w-56">
            {courses.map((course) => (
              <DropdownMenuItem 
                key={course.id}
                className={`text-gray-700 hover:text-blue-600 hover:bg-blue-50 ${course.active ? 'relative' : ''}`}
              >
                <div className="flex flex-col w-full">
                  <span>{course.name}</span>
                  {course.active && (
                    <span className="text-xs text-green-500 font-medium mt-1">
                      Active • {course.daysRemaining} days remaining
                    </span>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Time Period Dropdown */}
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
    </div>
  );
};

export default ProgressNavigation;
