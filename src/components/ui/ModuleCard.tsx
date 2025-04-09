
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";
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
  status: 'available' | 'coming-soon' | 'maintenance';
  rating: number;
  price: string;
}

interface ModuleCardProps {
  module: Module;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (module.status === 'available') {
      navigate(`/payment`, { state: { module } });
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div 
        className="relative h-40 overflow-hidden cursor-pointer" 
        onClick={handleCardClick}
      >
        <img 
          src={module.imageUrl} 
          alt={module.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
        />
        <div className="absolute top-0 left-0 p-2">
          <StatusBadge status={module.status} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
          <span className="text-white text-xs font-medium px-2 py-1 rounded-full bg-black/30">
            {module.category}
          </span>
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 
            className="font-semibold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2"
            onClick={handleCardClick}
          >
            {module.title}
          </h3>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <StarRating rating={module.rating} size="small" />
            <span className="ml-1 text-sm text-slate-600">
              {module.rating > 0 ? module.rating.toFixed(1) : 'New'}
            </span>
          </div>
          <span className="text-sm font-medium text-slate-700">
            {module.price}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{module.chaptersCount} chapters</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{module.participantsCount > 0 ? `${module.participantsCount.toLocaleString()} learners` : 'Coming soon'}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span>{module.questionsCount} questions</span>
          </div>
          <div className="flex items-center gap-1">
            <BadgeCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Certificate</span>
          </div>
        </div>
        
        <div className="mt-auto">
          <Button 
            variant={module.status === 'available' ? 'default' : 'outline'} 
            className={`w-full ${module.status === 'available' ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : ''}`}
            disabled={module.status !== 'available'}
            onClick={handleCardClick}
          >
            {module.status === 'available' ? 'Purchase Module' : 'Coming Soon'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ModuleCard;
