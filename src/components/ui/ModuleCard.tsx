import React from 'react';
import { cn } from '@/lib/utils';
import StarRating from './StarRating';
import StatusBadge from './StatusBadge';
import { Book, Crown, FileText, Users } from 'lucide-react';

export type Module = {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  questionsCount: number;
  chaptersCount: number;
  participantsCount: number;
  status: 'available' | 'coming-soon';
  rating: number;
  price: string;
};

interface ModuleCardProps {
  module: Module;
  className?: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, className }) => {
  return (
    <div 
      className={cn(
        'glass-card flex flex-col overflow-hidden rounded-xl w-full h-full',
        'animate-fade-up min-h-[450px] shadow-card', 
        className
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden group">
        <img 
          src={module.imageUrl} 
          alt={module.title}
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/60 to-transparent opacity-90 z-10" />
        <div className="absolute top-3 left-3 z-20">
          <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-xs text-xs font-medium border border-slate-200/20 shadow-sm">
            {module.category}
          </span>
        </div>
        
        {/* Premium badge for available modules */}
        {module.status === 'available' && (
          <div className="absolute top-3 right-3 z-20">
            <span className="px-3 py-1.5 rounded-full bg-amber-light/90 backdrop-blur-sm text-xs font-medium border border-amber-dark/10 shadow-sm flex items-center gap-1">
              <Crown size={12} className="text-amber-dark" />
              <span className="text-amber-dark font-semibold">Premium</span>
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        {/* Elegant title bar with subtle styling */}
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-cursive text-lg text-slate-800 mb-1 line-clamp-1">{module.title}</h3>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <FileText size={14} />
                {module.questionsCount} Questions
              </span>
              <span className="flex items-center gap-1.5">
                <Book size={14} />
                {module.chaptersCount} Chapters
              </span>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="p-5 flex flex-col gap-4 flex-1 bg-slate-50/50">
          {/* Participants count */}
          <div className="flex items-center gap-2 text-slate-600">
            <Users size={16} className="text-blue" />
            <span className="text-sm font-medium">{module.participantsCount.toLocaleString()} enrolled</span>
          </div>
          
          {/* Rating with number */}
          <div className="flex items-center justify-between">
            <StarRating rating={module.rating} showNumber={true} />
            <StatusBadge status={module.status} />
          </div>

          {/* Price with elegant styling */}
          <div className="mt-1">
            <p className="font-cursive text-indigo-700 text-lg">{module.price}</p>
          </div>

          <div className="mt-auto flex justify-end">
            <button
              className={cn(
                'px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300',
                'border shadow-sm',
                module.status === 'available' 
                  ? 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300' 
                  : 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
              )}
              disabled={module.status !== 'available'}
            >
              {module.status === 'available' ? (
                <span className="flex items-center gap-2">
                  <span>Explore</span>
                </span>
              ) : 'Coming Soon'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
