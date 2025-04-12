
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
import { UserProgress } from "@/services/progressService";

interface ProgressDashboardProps {
  period: string;
  type: string;
  className?: string;
  userData: UserProgress;
}

export default function ProgressDashboard({ 
  period, 
  type, 
  className, 
  userData 
}: ProgressDashboardProps) {
  const stats = [
    { 
      title: "Speed", 
      value: `${userData.speed}%`, 
      icon: Clock,
      color: "bg-purple-500",
      shadowColor: "shadow-purple-200",
      transparent: true
    },
    { 
      title: "Streak", 
      value: `${userData.streak} days`, 
      icon: Zap,
      color: "bg-amber-500",
      shadowColor: "shadow-amber-200",
      transparent: true,
      fill: true
    },
    { 
      title: "Avg Score", 
      value: `${userData.averageScore}`, 
      icon: Target,
      color: "bg-emerald-500",
      shadowColor: "shadow-emerald-200",
      transparent: true
    },
    { 
      title: "Rank", 
      value: `#${userData.rank}`, 
      icon: Trophy,
      color: "bg-blue-500",
      shadowColor: "shadow-blue-200",
      transparent: true,
      fill: true
    },
    { 
      component: () => (
        <ProjectedScore score={userData.projectedScore} />
      )
    },
  ];

  const difficultyStats = [
    { 
      title: "Easy Questions", 
      correct: userData.easyCompleted,
      total: userData.easyTotal,
      avgTime: `${userData.easyAvgTime} min`,
      color: "bg-emerald-500" 
    },
    { 
      title: "Medium Questions", 
      correct: userData.mediumCompleted,
      total: userData.mediumTotal,
      avgTime: `${userData.mediumAvgTime} min`,
      color: "bg-amber-500" 
    },
    { 
      title: "Hard Questions", 
      correct: userData.hardCompleted,
      total: userData.hardTotal,
      avgTime: `${userData.hardAvgTime} min`,
      color: "bg-rose-500" 
    },
  ];

  const timeManagementStats = {
    avgTimePerQuestion: `${userData.averageTime} min`,
    avgTimeCorrect: `${userData.correctAnswerAvgTime} min`,
    avgTimeIncorrect: `${userData.incorrectAnswerAvgTime} min`,
    longestQuestion: `${userData.longestQuestionTime} min`,
  };

  return (
    <AnimatedContainer className={cn("space-y-8", className)}>
      <StatsCardGrid stats={stats} />
      
      <AnimatedContainer className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnimatedItem>
          <TotalProgressCard 
            totalQuestions={userData.correctAnswers + userData.incorrectAnswers + userData.unattemptedQuestions} 
            correctQuestions={userData.correctAnswers}
            incorrectQuestions={userData.incorrectAnswers}
            unattemptedQuestions={userData.unattemptedQuestions}
          />
        </AnimatedItem>

        <AnimatedItem className="lg:col-span-2">
          <PerformanceGraphCard data={userData.performanceGraph} />
        </AnimatedItem>
      </AnimatedContainer>

      <DifficultyStatsGrid stats={difficultyStats} />

      <AnimatedContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimeManagementCard timeManagementStats={timeManagementStats} />
        <GoalsCard goals={userData.goals} />
      </AnimatedContainer>

      <AnimatedContainer className="grid grid-cols-1 gap-6">
        <AnimatedItem>
          <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300">
            <ChapterProgress chapters={userData.chapterPerformance} />
          </Card>
        </AnimatedItem>
      </AnimatedContainer>

      <style jsx global>{`
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
