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
  segments = 8,
  showLabel = true,
  className,
  total = 100,
  completed = 20,
}: SegmentedProgressProps) => {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  const radius = 75; // Increased from 60 to 75 (25% larger)
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const gap = 2;
  const segmentAngle = (360 - (segments * gap)) / segments;
  
  const createSegments = () => {
    const segments_array = [];
    for (let i = 0; i < segments; i++) {
      const startAngle = i * (segmentAngle + gap) - 90;
      const endAngle = startAngle + segmentAngle;
      
      const segmentProgress = (i + 1) * (100 / segments);
      const isActive = normalizedProgress >= segmentProgress;
      
      segments_array.push({
        path: `
          M ${120 + (radius - strokeWidth/2) * Math.cos((startAngle * Math.PI) / 180)}
          ${120 + (radius - strokeWidth/2) * Math.sin((startAngle * Math.PI) / 180)}
          A ${radius - strokeWidth/2} ${radius - strokeWidth/2} 0 0 1
          ${120 + (radius - strokeWidth/2) * Math.cos((endAngle * Math.PI) / 180)}
          ${120 + (radius - strokeWidth/2) * Math.sin((endAngle * Math.PI) / 180)}
        `,
        isActive
      });
    }
    return segments_array;
  };

  return (
    <div className={cn("relative w-60 h-60 mx-auto", className)}>
      <svg className="w-full h-full -rotate-90">
        {createSegments().map((segment, index) => (
          <path
            key={index}
            d={segment.path}
            className={cn(
              "stroke-[12] fill-none transition-all duration-300",
              segment.isActive ? "stroke-[#4ade80]" : "stroke-gray-100"
            )}
          />
        ))}
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold text-gray-800">
            {normalizedProgress}%
          </span>
          <span className="text-sm text-gray-600 mt-1">
            {completed}/{total}
          </span>
        </div>
      )}
    </div>
  );
};

export default SegmentedProgress;