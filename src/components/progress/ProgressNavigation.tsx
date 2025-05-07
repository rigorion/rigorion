import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Settings, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TimePeriod } from "@/types/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
  selectedCourse?: string;
  setSelectedCourse?: (courseId: string) => void;
  courses?: Array<{
    id: string;
    name: string;
    status: 'active' | 'expired';
    expiresIn: number;
  }>;
}
export const ProgressNavigation: React.FC<ProgressNavigationProps> = ({
  sidebarOpen,
  setSidebarOpen,
  setPeriod,
  visibleSections,
  setVisibleSections,
  selectedCourse,
  setSelectedCourse,
  courses = []
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center space-x-4">
        
        
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Course Selection Dropdown with Expiry Badge - Updated Styling */}
        {courses.length > 0 && setSelectedCourse && <div className="relative">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[180px] bg-white hover:bg-gray-50 shadow-sm border-gray-100">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {courses.map(course => <SelectItem key={course.id} value={course.id} className="flex items-center justify-between">
                    <span>{course.name}</span>
                  </SelectItem>)}
              </SelectContent>
            </Select>
            {/* Green Badge for Active Course Expiry */}
            {courses.find(c => c.id === selectedCourse)?.status === 'active' && <Badge className="absolute -top-2 -right-2 course-expiry-badge">
                {courses.find(c => c.id === selectedCourse)?.expiresIn} days
              </Badge>}
          </div>}
        
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
    </div>;
};
export default ProgressNavigation;