
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users } from "lucide-react";

interface GlobalAnalysisProps {
  percentile: number;
  averageDaily: number;
  yourDaily: number;
  totalUsersCount: number;
}

export const GlobalAnalysisCard = ({
  percentile = 85,
  averageDaily = 15,
  yourDaily = 25,
  totalUsersCount = 5280
}: GlobalAnalysisProps) => {
  // Determine the color and message based on percentile
  const getPercentileColor = () => {
    if (percentile >= 90) return "text-green-500";
    if (percentile >= 70) return "text-blue-500";
    if (percentile >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getPercentileMessage = () => {
    if (percentile >= 90) return "Exceptional! You're in the top performers.";
    if (percentile >= 70) return "Great work! You're ahead of most students.";
    if (percentile >= 50) return "You're making good progress.";
    if (percentile >= 30) return "You're on the right track.";
    return "Keep going, there's room for improvement.";
  };

  return (
    <Card className="bg-white border border-gray-50">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Global Analysis</h3>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-500">{totalUsersCount.toLocaleString()} students</span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Your Effort Percentile</span>
              <span className={`text-xl font-bold ${getPercentileColor()}`}>{percentile}%</span>
            </div>
            
            <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                style={{ width: `${percentile}%` }}
              />
            </div>
            
            <p className="text-sm text-gray-600 italic mt-1">{getPercentileMessage()}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex flex-col p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-600">Your Daily Average</span>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-lg font-semibold">{yourDaily} questions</span>
              </div>
            </div>
            
            <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Global Daily Average</span>
              <div className="flex items-center gap-1 mt-1">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-lg font-semibold">{averageDaily} questions</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobalAnalysisCard;
