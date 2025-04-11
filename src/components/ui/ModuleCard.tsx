
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

export interface Module {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  questionsCount: number;
  chaptersCount: number;
  participantsCount: number;
  status: "available" | "coming-soon";
  rating: number;
  price: string;
  examsCount?: number; // Added exams count
}

interface ModuleCardProps {
  module: Module;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (module.status === "available") {
      navigate('/payment', { state: { module } });
    }
  };

  // Calculate percentages based on total values
  const questionsPercent = Math.min(100, (module.questionsCount / 3000) * 100);
  const chaptersPercent = Math.min(100, (module.chaptersCount / 12) * 100);
  const examsPercent = Math.min(100, ((module.examsCount || 0) / 7) * 100);
  
  // Generate stars for rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i}
          size={16} 
          className={i <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} 
        />
      );
    }
    return stars;
  };
  
  return (
    <Card className="overflow-hidden bg-white rounded-xl transition-all duration-300 hover:shadow-md border border-gray-100">
      <div className="relative">
        {/* Status badge */}
        {module.status === "available" ? (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full">
            Available
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-medium px-3 py-1 rounded-full">
            Coming Soon
          </div>
        )}
        
        {/* Card content */}
        <div className="p-6">
          <div className="text-blue-600 uppercase text-sm font-medium tracking-wide mb-4">
            {module.category}
          </div>
          
          {/* Progress bars section */}
          <div className="mb-6 space-y-4">
            <div className="flex justify-between items-center">
              <Progress className="h-1.5 bg-blue-100" value={questionsPercent} />
              <span className="text-sm text-gray-600 ml-3 whitespace-nowrap">{module.questionsCount} questions</span>
            </div>
            
            <div className="flex justify-between items-center">
              <Progress className="h-1.5 bg-amber-100" value={chaptersPercent} />
              <span className="text-sm text-gray-600 ml-3 whitespace-nowrap">{module.chaptersCount} chapters</span>
            </div>
            
            <div className="flex justify-between items-center">
              <Progress className="h-1.5 bg-gray-100" value={examsPercent} />
              <span className="text-sm text-gray-600 ml-3 whitespace-nowrap">{module.examsCount || 0} exams</span>
            </div>
          </div>
          
          {/* Rating and participants */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="flex mr-2">
                {renderStars(Math.round(module.rating))}
              </div>
              {module.rating > 0 && (
                <span className="text-amber-600 font-medium">
                  {module.rating.toFixed(1)}
                </span>
              )}
            </div>
            <span className="text-sm text-gray-600">
              {module.participantsCount} participants
            </span>
          </div>
          
          {/* Join button */}
          {module.status === "available" && (
            <button
              onClick={handleClick}
              className="w-full py-2.5 rounded-md bg-gradient-to-r from-red-500 to-red-600 text-white font-medium transition-all duration-300 hover:shadow-md hover:from-red-600 hover:to-red-700 animate-pulse-subtle glow-button"
            >
              Join Now
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ModuleCard;
