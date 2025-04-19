
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
import { UserProgress } from "@/services/types/progressTypes";

interface ProgressDashboardProps {
  period: string;
  type: string;
  className?: string;
  userData: UserProgress;
}

export const ProgressDashboard = ({
  period,
  type,
  className,
  userData
}: ProgressDashboardProps) => {
  const stats = [{
    title: "Speed",
    value: `${userData.speed}%`,
    icon: Clock,
    color: "bg-purple-500",
    shadowColor: "shadow-purple-200",
    transparent: true
  }, {
    title: "Streak",
    value: `${userData.streak} days`,
    icon: Zap,
    color: "bg-amber-500",
    shadowColor: "shadow-amber-200",
    transparent: true,
    fill: true
  }, {
    title: "Avg Score",
    value: `${userData.averageScore}`,
    icon: Target,
    color: "bg-emerald-500",
    shadowColor: "shadow-emerald-200",
    transparent: true
  }, {
    title: "Rank",
    value: `#${userData.rank}`,
    icon: Trophy,
    color: "bg-blue-500",
    shadowColor: "shadow-blue-200",
    transparent: true,
    fill: true
  }, {
    component: () => <ProjectedScore score={userData.projectedScore} />
  }];
  
  const difficultyStats = [{
    title: "Easy Questions",
    correct: userData.easyCompleted,
    total: userData.easyTotal,
    avgTime: `${userData.easyAvgTime} min`,
    color: "bg-emerald-500"
  }, {
    title: "Medium Questions",
    correct: userData.mediumCompleted,
    total: userData.mediumTotal,
    avgTime: `${userData.mediumAvgTime} min`,
    color: "bg-emerald-500" // Changed from amber-500 to emerald-500
  }, {
    title: "Hard Questions",
    correct: userData.hardCompleted,
    total: userData.hardTotal,
    avgTime: `${userData.hardAvgTime} min`,
    color: "bg-amber-500" // Changed from rose-500 to amber-500
  }];
  
  const timeManagementStats = {
    avgTimePerQuestion: `${userData.averageTime} min`,
    avgTimeCorrect: `${userData.correctAnswerAvgTime} min`,
    avgTimeIncorrect: `${userData.incorrectAnswerAvgTime} min`,
    longestQuestion: `${userData.longestQuestionTime} min`
  };
  
  return <AnimatedContainer className={cn("space-y-8", className)}>
      {/* Stats Row - Horizontal with small width containers */}
      <div className="flex justify-center">
        <div className="max-w-4xl w-full">
          <StatsCardGrid stats={stats} />
        </div>
      </div>
      
      <AnimatedContainer className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnimatedItem>
          <TotalProgressCard totalQuestions={userData.correctAnswers + userData.incorrectAnswers + userData.unattemptedQuestions} correctQuestions={userData.correctAnswers} incorrectQuestions={userData.incorrectAnswers} unattemptedQuestions={userData.unattemptedQuestions} />
        </AnimatedItem>

        <AnimatedItem className="lg:col-span-2">
          <PerformanceGraphCard data={userData.performanceGraph} />
        </AnimatedItem>
      </AnimatedContainer>

      <DifficultyStatsGrid stats={difficultyStats} />

      <AnimatedContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: Chapter Progress */}
        <AnimatedItem>
          <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white h-full">
            <ChapterProgress chapters={userData.chapterPerformance} />
          </Card>
        </AnimatedItem>

        {/* Right column: Time Management and Goals stacked */}
        <AnimatedContainer className="space-y-6">
          <TimeManagementCard timeManagementStats={timeManagementStats} />
          <GoalsCard goals={userData.goals} />
        </AnimatedContainer>
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
    </AnimatedContainer>;
}

// Make sure to properly export the component as default 
// while also maintaining the named export for backwards compatibility
export default ProgressDashboard;
