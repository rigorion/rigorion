
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
  segments = 10,
  showLabel = true,
  className,
  total = 100,
  completed = 20
}: SegmentedProgressProps) => {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  const radius = 85; // Increased for better visibility
  const strokeWidth = 14; // Increased thickness
  const circumference = 2 * Math.PI * radius;
  const gap = 2;
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
          M ${120 + (radius - strokeWidth / 2) * Math.cos(startAngle * Math.PI / 180)}
          ${120 + (radius - strokeWidth / 2) * Math.sin(startAngle * Math.PI / 180)}
          A ${radius - strokeWidth / 2} ${radius - strokeWidth / 2} 0 0 1
          ${120 + (radius - strokeWidth / 2) * Math.cos(endAngle * Math.PI / 180)}
          ${120 + (radius - strokeWidth / 2) * Math.sin(endAngle * Math.PI / 180)}
        `,
        isActive,
        progress: Math.min(100, Math.max(0, (normalizedProgress - (segmentProgress - (100 / segments))) * segments))
      });
    }
    return segments_array;
  };

  // Create a gradient effect for the segments
  const gradientId = `progressGradient-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={cn("relative w-60 h-60 mx-auto", className)}>
      <svg className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
          
          {/* Add a subtle glow filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background circle for better visual context */}
        <circle 
          cx="120" 
          cy="120" 
          r={radius} 
          fill="none" 
          stroke="#f3f4f6" 
          strokeWidth={strokeWidth - 2} 
          strokeLinecap="round"
        />
        
        {createSegments().map((segment, index) => (
          <path 
            key={index} 
            d={segment.path} 
            className={cn(
              "stroke-[14] fill-none transition-all duration-500", 
              segment.isActive ? "filter drop-shadow-md" : "stroke-gray-100"
            )}
            stroke={segment.isActive ? `url(#${gradientId})` : "#f3f4f6"}
            strokeLinecap="round"
            style={{
              filter: segment.isActive ? 'url(#glow)' : 'none',
              transition: 'all 0.5s ease-out'
            }}
          />
        ))}
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent">
          <span className="font-semibold text-indigo-950 text-3xl text-center">
            {normalizedProgress}%
          </span>
          <span className="text-sm text-gray-600 mt-1">
            {completed}/{total}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            completed
          </span>
        </div>
      )}
    </div>
  );
};

export default SegmentedProgress;
