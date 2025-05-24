
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  durationInSeconds: number;
  onComplete: () => void;
  isActive: boolean;
  mode?: "timer" | "level" | "manual" | "pomodoro" | "exam";
  className?: string;
  onUpdate?: (formattedTime: string) => void;
  autoNavigate?: boolean;
  onAutoNavigate?: () => void;
}

const CountdownTimer = ({ 
  durationInSeconds, 
  onComplete, 
  isActive,
  mode = "timer",
  className,
  onUpdate,
  autoNavigate = false,
  onAutoNavigate
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);
  const [isPaused, setIsPaused] = useState(false);

  // Full reset when duration changes
  useEffect(() => {
    setTimeLeft(durationInSeconds);
    setIsPaused(false);
  }, [durationInSeconds]);

  // Timer countdown effect
  useEffect(() => {
    if (!isActive || isPaused) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        
        if (newTime <= 0) {
          clearInterval(timer);
          onComplete();
          
          // Auto-navigate to next question in timer mode
          if (autoNavigate && onAutoNavigate && mode === "timer") {
            setTimeout(() => {
              onAutoNavigate();
            }, 500); // Small delay to show completion
          }
          
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, isPaused, onComplete, durationInSeconds, autoNavigate, onAutoNavigate, mode]);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    // Call onUpdate if provided
    if (onUpdate) {
      onUpdate(formattedTime);
    }
    
    return formattedTime;
  };

  // Calculate percentage for visual feedback
  const percentageLeft = durationInSeconds > 0 
    ? (timeLeft / durationInSeconds) * 100 
    : 0;

  const isWarning = percentageLeft < 30;
  const isCritical = percentageLeft < 10;

  // Map color scheme based on mode
  const getColorScheme = () => {
    switch (mode) {
      case "pomodoro":
        return {
          text: isCritical ? "text-red-600" : "text-red-500",
          glow: "0 0 8px rgba(220,38,38,0.5)",
          border: ""
        };
      case "exam":
        return {
          text: isCritical ? "text-orange-600" : "text-orange-500",
          glow: "0 0 8px rgba(234,88,12,0.5)",
          border: ""
        };
      case "timer":
      default:
        return {
          text: isCritical ? "text-blue-600" : "text-blue-500",
          glow: "0 0 8px rgba(59,130,246,0.5)",
          
        };
    }
  };

  const colorScheme = getColorScheme();

  return (
    <div className={cn(
      "inline-flex items-center justify-center p-3 bg-white rounded-full min-w-[90px] transition-all",
      isWarning ? "animate-pulse" : "",
      colorScheme.border,
      className
    )}>
      <span 
        className={cn("font-mono text-lg font-bold", colorScheme.text)}
        style={{ textShadow: colorScheme.glow }}
      >
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};

export default CountdownTimer;
