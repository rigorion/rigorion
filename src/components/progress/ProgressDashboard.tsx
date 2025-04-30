
import { Card } from "@/components/ui/card";
import { Calendar, Zap, Trophy, Target } from 'lucide-react';
import { ChapterProgress } from "./ChapterProgress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { StatsCardGrid } from "./StatsCard";
import { TotalProgressCard } from "./TotalProgressCard";
import { PerformanceGraphCard } from "./PerformanceGraphCard";
import { DifficultyStatsGrid } from "./DifficultyStatsGrid";
import { GoalsCard } from "./GoalsCard";
import { TestMocksList } from "./TestMocksList";
import { AnimatedContainer, AnimatedItem } from "./AnimationWrappers";
import { ProjectedScore } from "@/components/stats/ProjectedScore";
import { UserProgressData } from "@/types/progress";
import { useState } from "react";
import { Footer } from "@/components/Footer";
import { GlobalAnalysisCard } from "./GlobalAnalysisCard";

interface ProgressDashboardProps {
  period: string;
  type: string;
  className?: string;
  userData: UserProgressData;
  visibleSections?: Record<string, boolean>;
}

export const ProgressDashboard = ({
  period,
  type,
  className,
  userData,
  visibleSections = {
    totalProgress: true,
    performanceGraph: true,
    difficultyStats: true,
    chapterProgress: true,
    goals: true
  }
}: ProgressDashboardProps) => {
  const [examDate, setExamDate] = useState<Date | null>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const daysToExam = examDate ? Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 30;
  
  // Mock tests data
  const mockTests = [{
    id: '1',
    name: 'Mock Test 1',
    status: 'completed' as const,
    score: 92,
    date: '2024-03-15'
  }, {
    id: '2',
    name: 'Mock Test 2',
    status: 'completed' as const,
    score: 87,
    date: '2024-03-20'
  }, {
    id: '3',
    name: 'Mock Test 3',
    status: 'in-progress' as const
  }, {
    id: '4',
    name: 'Mock Test 4',
    status: 'incomplete' as const
  }, {
    id: '5',
    name: 'Mock Test 5',
    status: 'unattempted' as const
  }];

  // Stats data with updated styling and content
  const stats = [{
    title: "Days to Exam",
    value: `${daysToExam} days`,
    icon: Calendar,
    color: "text-blue-500",
    isCalendar: true,
    onSelect: setExamDate,
    selectedDate: examDate
  }, {
    title: "Streak",
    value: `${userData.streak} days`,
    icon: Zap,
    color: "text-blue-500"
  }, {
    title: "Recommended Problems/Day",
    value: "25",
    icon: Target,
    color: "text-blue-500"
  }, {
    title: "Rank",
    value: `#${userData.rank}`,
    icon: Trophy,
    color: "text-blue-500"
  }, {
    component: () => <ProjectedScore score={userData.projectedScore} />
  }];

  // Update the difficulty stats colors to use light blue instead of orange
  const difficultyStats = [{
    title: "Easy Questions",
    correct: userData.easyCompleted,
    total: userData.easyTotal,
    avgTime: `${userData.easyAvgTime} min`,
    color: "bg-blue-100"
  }, {
    title: "Medium Questions",
    correct: userData.mediumCompleted,
    total: userData.mediumTotal,
    avgTime: `${userData.mediumAvgTime} min`,
    color: "bg-blue-200"
  }, {
    title: "Hard Questions",
    correct: userData.hardCompleted,
    total: userData.hardTotal,
    avgTime: `${userData.hardAvgTime} min`,
    color: "bg-blue-300"
  }];

  return (
    <AnimatedContainer className={cn("space-y-6 px-2 sm:px-4 md:px-6", className)}>
      {/* Stats Cards */}
      <div className="flex justify-center">
        <div className="w-full">
          <StatsCardGrid stats={stats} />
        </div>
      </div>
      
      {/* Total Progress + Global Analysis Grid */}
      <AnimatedContainer className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <AnimatedItem>
          <TotalProgressCard 
            totalQuestions={userData.correctAnswers + userData.incorrectAnswers + userData.unattemptedQuestions} 
            correctQuestions={userData.correctAnswers} 
            incorrectQuestions={userData.incorrectAnswers} 
            unattemptedQuestions={userData.unattemptedQuestions} 
            alwaysVisible={true}
          />
        </AnimatedItem>

        <AnimatedItem>
          <GlobalAnalysisCard 
            percentile={85}
            averageDaily={15}
            yourDaily={25}
            totalUsersCount={5280}
          />
        </AnimatedItem>
      </AnimatedContainer>
      
      {/* Chapter Progress */}
      {visibleSections.chapterProgress && (
        <AnimatedItem>
          <Card className="p-6 bg-white border border-gray-50 h-[480px] overflow-auto">
            <ChapterProgress chapters={userData.chapterPerformance} />
          </Card>
        </AnimatedItem>
      )}

      {/* Performance Graph + Test Mocks Grid */}
      <AnimatedContainer className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {visibleSections.performanceGraph && (
          <AnimatedItem className="lg:col-span-8">
            <PerformanceGraphCard data={userData.performanceGraph} />
          </AnimatedItem>
        )}

        <AnimatedItem className="lg:col-span-4">
          <TestMocksList tests={mockTests} />
        </AnimatedItem>
      </AnimatedContainer>

      {/* Difficulty Stats */}
      <DifficultyStatsGrid stats={difficultyStats} />

      {/* Goals */}
      {visibleSections.goals && (
        <AnimatedItem>
          <GoalsCard goals={userData.goals} />
        </AnimatedItem>
      )}

      <Footer />
      
      {/* Add responsive styles - Fix TypeScript error by using a standard style tag without jsx and global props */}
      <style>
        {`
        @media (max-width: 640px) {
          .recharts-responsive-container {
            height: 250px !important;
          }
          
          .recharts-text {
            font-size: 10px;
          }
        }
        
        @media (max-width: 480px) {
          .recharts-responsive-container {
            height: 200px !important;
          }
          
          h3 {
            font-size: 16px;
          }
          
          table {
            font-size: 12px;
          }
          
          .recharts-surface {
            overflow: visible;
          }
        }
        `}
      </style>
    </AnimatedContainer>
  );
};

export default ProgressDashboard;
