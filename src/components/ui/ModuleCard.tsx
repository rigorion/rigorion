
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import StarRating from './StarRating';
import StatusBadge from './StatusBadge';

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
  
  return (
    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg border-0 shadow-md bg-white rounded-xl">
      <div 
        className={`relative cursor-pointer ${module.status === "available" ? "group" : ""}`}
        onClick={module.status === "available" ? handleClick : undefined}
      >
        <div className="relative h-48 overflow-hidden">
          <img 
            src={module.imageUrl} 
            alt={module.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <StatusBadge status={module.status} />
          </div>
        </div>
        
        <CardContent className="p-5">
          <div className="text-xs font-medium text-blue-600 mb-2 uppercase tracking-wider">
            {module.category}
          </div>
          
          <h3 className="font-semibold text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {module.title}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <StarRating rating={module.rating} />
              {module.rating > 0 && (
                <span className="text-xs text-slate-500 ml-1">
                  ({module.rating.toFixed(1)})
                </span>
              )}
            </div>
            <span className="text-sm font-medium text-blue-600">
              {module.price}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-slate-500 border-t pt-3 mt-3">
            <div>{module.questionsCount} questions</div>
            <div>{module.chaptersCount} chapters</div>
            <div>{module.participantsCount} participants</div>
          </div>
          
          {module.status === "available" && (
            <div className="absolute inset-0 bg-blue-600/0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-blue-600/10 transition-all duration-300">
              <button className="bg-blue-600 text-white px-3 py-1.5 rounded-full transform scale-0 group-hover:scale-100 transition-all duration-300 text-sm font-medium hover:bg-blue-700">
                Subscribe Now
              </button>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default ModuleCard;
