
import { Card } from "@/components/ui/card";
import { Clock, Zap, Trophy, Target, Brain } from 'lucide-react';
import { ChapterProgress } from "./ChapterProgress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { StatsCardGrid } from "./StatsCard";
import { TotalProgressCard } from "./TotalProgressCard";
import { PerformanceGraphCard } from "./PerformanceGraphCard";
import { DifficultyStatsGrid } from "./DifficultyStatsCard";
import { TimeManagementCard } from "./TimeManagementCard";
import { GoalsCard } from "./GoalsCard";
import { AnimatedContainer, AnimatedItem } from "./AnimationWrappers";
import { ProjectedScore } from "@/components/stats/ProjectedScore";

interface ProgressDashboardProps {
  period: string;
  type: string;
  className?: string;
}

export default function ProgressDashboard({ period, type, className }: ProgressDashboardProps) {
  const stats = [
    { 
      title: "Speed", 
      value: "85%", 
      icon: Clock,
      color: "bg-blue-600",
      shadowColor: "shadow-blue-200",
      transparent: true
    },
    { 
      title: "Streak", 
      value: "7 days", 
      icon: Zap,
      color: "bg-amber-500",
      shadowColor: "shadow-amber-200",
      transparent: true,
      fill: true
    },
    { 
      title: "Avg Score", 
      value: "92", 
      icon: Target,
      color: "bg-purple-500",
      shadowColor: "shadow-purple-200",
      transparent: true
    },
    { 
      title: "Rank", 
      value: "#120", 
      icon: Trophy,
      color: "bg-amber-500",
      shadowColor: "shadow-amber-200",
      transparent: true,
      fill: true
    },
    { 
      component: ProjectedScore
    },
  ];

  const difficultyStats = [
    { 
      title: "Easy Questions", 
      correct: 45,
      total: 50,
      avgTime: "1.5 min",
      color: "bg-emerald-500" 
    },
    { 
      title: "Medium Questions", 
      correct: 35,
      total: 50,
      avgTime: "2.5 min",
      color: "bg-amber-500" 
    },
    { 
      title: "Hard Questions", 
      correct: 25,
      total: 30,
      avgTime: "4 min",
      color: "bg-rose-500" 
    },
  ];

  const timeManagementStats = {
    avgTimePerQuestion: "2.5 min",
    avgTimeCorrect: "2 min",
    avgTimeIncorrect: "3.5 min",
    longestQuestion: "8 min",
  };

  const goals = [
    {
      title: "Complete 100 Questions",
      current: 75,
      target: 100,
      deadline: "2024-05-01",
    },
    {
      title: "Achieve 90% in Hard Questions",
      current: 83,
      target: 90,
      deadline: "2024-05-15",
    },
  ];

  const totalQuestions = 130;
  const correctQuestions = 53;
  const incorrectQuestions = 21;
  const unattemptedQuestions = 56;

  return (
    <AnimatedContainer className={cn("space-y-6", className)}>
      <StatsCardGrid stats={stats} />
      
      <AnimatedContainer className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AnimatedItem>
          <TotalProgressCard 
            totalQuestions={totalQuestions} 
            correctQuestions={correctQuestions}
            incorrectQuestions={incorrectQuestions}
            unattemptedQuestions={unattemptedQuestions}
          />
        </AnimatedItem>

        <AnimatedItem className="lg:col-span-2">
          <PerformanceGraphCard />
        </AnimatedItem>
      </AnimatedContainer>

      <DifficultyStatsGrid stats={difficultyStats} />

      <AnimatedContainer className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TimeManagementCard timeManagementStats={timeManagementStats} />
        <GoalsCard goals={goals} />
      </AnimatedContainer>

      <AnimatedContainer className="grid grid-cols-1 gap-4">
        <AnimatedItem>
          <Card className="p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <ChapterProgress />
          </Card>
        </AnimatedItem>
      </AnimatedContainer>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
      `}</style>
    </AnimatedContainer>
  );
}
