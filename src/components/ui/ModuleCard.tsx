
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

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
  examsCount?: number;
}

interface ModuleCardProps {
  module: Module;
  featured?: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  featured = false
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (module.status === "available") {
      navigate('/payment', {
        state: {
          module
        }
      });
    }
  };

  // Generate stars for rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={14} 
          className={i <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} 
        />
      );
    }
    return stars;
  };

  // Regular module card - streaming style
  return (
    <Card 
      className="overflow-hidden bg-white rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg border border-gray-100 group"
      onClick={handleClick}
    >
      <AspectRatio ratio={16/9} className="bg-gray-100">
        <img 
          src={module.imageUrl} 
          alt={module.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <Badge className={`px-2 py-0.5 text-xs font-medium ${
            module.status === "available" ? "bg-orange-500 text-white" : "bg-amber-500 text-white"
          }`}>
            {module.status === "available" ? "Available" : "Coming Soon"}
          </Badge>
        </div>
      </AspectRatio>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-2 mb-1">{module.title}</h3>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-600">{module.category}</span>
          {module.status === "available" && (
            <div className="flex items-center">
              {renderStars(Math.round(module.rating))}
              <span className="ml-1 text-xs font-medium">{module.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500">
          {module.questionsCount} questions
        </div>
      </div>
    </Card>
  );
};

export default ModuleCard;
