
import React from 'react';
import { cn } from "@/lib/utils";

interface SegmentedProgressProps {
  progress: number;
  segments?: number;
  showLabel?: boolean;
  className?: string;
  total?: number;
  completed?: number;
}

const SegmentedProgress = ({
  progress,
  segments = 48,
  showLabel = true,
  className,
  total = 100,
  completed = 20
}: SegmentedProgressProps) => {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  const radius = 90;
  const strokeWidth = 10;
  const gap = 0.8;
  const segmentAngle = (360 - segments * gap) / segments;
  
  const createSegments = () => {
    const segments_array = [];
    for (let i = 0; i < segments; i++) {
      const startAngle = i * (segmentAngle + gap) - 90;
      const endAngle = startAngle + segmentAngle;
      const segmentProgress = (i + 1) * (100 / segments);
      const isActive = normalizedProgress >= segmentProgress - (100 / segments);
      
      segments_array.push({
        path: `
          M ${120 + radius * Math.cos(startAngle * Math.PI / 180)}
          ${120 + radius * Math.sin(startAngle * Math.PI / 180)}
          A ${radius} ${radius} 0 0 1
          ${120 + radius * Math.cos(endAngle * Math.PI / 180)}
          ${120 + radius * Math.sin(endAngle * Math.PI / 180)}
        `,
        isActive,
        progress: Math.min(100, Math.max(0, (normalizedProgress - (segmentProgress - (100 / segments))) * segments))
      });
    }
    return segments_array;
  };

  const gradientId = `progressGradient-${Math.random().toString(36).substring(2, 9)}`;
  const glowFilter = `progressGlow-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={cn("relative transition-all duration-300 hover:scale-105", className)}>
      <svg className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          
          <filter id={glowFilter}>
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background segments */}
        <circle 
          cx="120" 
          cy="120" 
          r={radius} 
          fill="none" 
          stroke="#f1f5f9" 
          strokeWidth={strokeWidth} 
          strokeDasharray="3,1.5"
        />
        
        {createSegments().map((segment, index) => (
          <path 
            key={index} 
            d={segment.path} 
            className={cn(
              "transition-all duration-500",
              segment.isActive ? "filter drop-shadow-lg" : "stroke-slate-200"
            )}
            stroke={segment.isActive ? `url(#${gradientId})` : "#e2e8f0"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            style={{
              filter: segment.isActive ? `url(#${glowFilter})` : 'none',
              transition: 'all 0.5s ease-out'
            }}
          />
        ))}
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            {normalizedProgress}%
          </span>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-sm font-medium text-indigo-600">{completed}</span>
            <span className="text-sm text-slate-400">/</span>
            <span className="text-sm text-slate-600">{total}</span>
          </div>
          <span className="text-xs text-slate-500 mt-1">
            completed
          </span>
        </div>
      )}
    </div>
  );
};

export default SegmentedProgress;
