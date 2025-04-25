import { Card } from "@/components/ui/card";
import { Calendar, Zap, Trophy, Target, Clock } from 'lucide-react';
import { ChapterProgress } from "./ChapterProgress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { StatsCardGrid } from "./StatsCard";
import { TotalProgressCard } from "./TotalProgressCard";
import { PerformanceGraphCard } from "./PerformanceGraphCard";
import { DifficultyStatsGrid } from "./DifficultyStatsCard";
import { TimeManagementCard } from "./TimeManagementCard";
import { GoalsCard } from "./GoalsCard";
import { TestMocksList } from "./TestMocksList";
import { AnimatedContainer, AnimatedItem } from "./AnimationWrappers";
import { ProjectedScore } from "@/components/stats/ProjectedScore";
import { UserProgressData } from "@/types/progress";
import { useState } from "react";

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
    timeManagement: true,
    goals: true
  }
}: ProgressDashboardProps) => {
  const [examDate, setExamDate] = useState<Date | null>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // 30 days from now
  
  const daysToExam = examDate ? 
    Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 
    30;

  // Mock tests data - now using a regular array instead of a const assertion
  const mockTests = [
    { id: '1', name: 'Mock Test 1', status: 'completed' as const, score: 92, date: '2024-03-15' },
    { id: '2', name: 'Mock Test 2', status: 'completed' as const, score: 87, date: '2024-03-20' },
    { id: '3', name: 'Mock Test 3', status: 'in-progress' as const },
    { id: '4', name: 'Mock Test 4', status: 'incomplete' as const },
    { id: '5', name: 'Mock Test 5', status: 'incomplete' as const }
  ];

  // Stats data with colorful icons
  const stats = [{
    title: "Days to Exam",
    value: `${daysToExam} days`,
    icon: Calendar,
    color: "text-purple-500",
    backgroundColor: "bg-purple-50",
  }, {
    title: "Streak",
    value: `${userData.streak} days`,
    icon: Zap,
    color: "text-amber-500",
    backgroundColor: "bg-amber-50",
  }, {
    title: "Avg Score",
    value: `${userData.averageScore}`,
    icon: Target,
    color: "text-emerald-500",
    backgroundColor: "bg-emerald-50",
  }, {
    title: "Rank",
    value: `#${userData.rank}`,
    icon: Trophy,
    color: "text-blue-500",
    backgroundColor: "bg-blue-50",
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
    color: "bg-emerald-500"
  }, {
    title: "Hard Questions",
    correct: userData.hardCompleted,
    total: userData.hardTotal,
    avgTime: `${userData.hardAvgTime} min`,
    color: "bg-amber-500"
  }];
  
  const timeManagementStats = {
    avgTimePerQuestion: `${userData.averageTime} min`,
    avgTimeCorrect: `${userData.correctAnswerAvgTime} min`,
    avgTimeIncorrect: `${userData.incorrectAnswerAvgTime} min`,
    longestQuestion: `${userData.longestQuestionTime} min`
  };
  
  return (
    <AnimatedContainer className={cn("space-y-8", className)}>
      {/* Stats Row - Horizontal with small width containers */}
      <div className="flex justify-center">
        <div className="max-w-4xl w-full">
          <StatsCardGrid stats={stats} />
        </div>
      </div>
      
      <AnimatedContainer className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Progress Card - Always visible */}
        <AnimatedItem>
          <TotalProgressCard 
            totalQuestions={userData.correctAnswers + userData.incorrectAnswers + userData.unattemptedQuestions} 
            correctQuestions={userData.correctAnswers} 
            incorrectQuestions={userData.incorrectAnswers} 
            unattemptedQuestions={userData.unattemptedQuestions} 
            alwaysVisible={true}
          />
        </AnimatedItem>

        {/* Performance Graph - Optional visibility */}
        {visibleSections.performanceGraph && (
          <AnimatedItem className="lg:col-span-2">
            <PerformanceGraphCard data={userData.performanceGraph} />
          </AnimatedItem>
        )}
      </AnimatedContainer>

      {/* Difficulty Stats - Optional visibility */}
      <DifficultyStatsGrid stats={difficultyStats} />

      <AnimatedContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chapter Progress - Optional visibility */}
        {visibleSections.chapterProgress && (
          <AnimatedItem>
            <Card className="p-6 hover:shadow-sm transition-all duration-300 bg-white h-full border border-gray-50">
              <ChapterProgress chapters={userData.chapterPerformance} />
            </Card>
          </AnimatedItem>
        )}

        {/* Right column: Time Management and Goals stacked */}
        <AnimatedContainer className="space-y-6">
          {/* Time Management - Optional visibility */}
          {visibleSections.timeManagement && (
            <TimeManagementCard timeManagementStats={timeManagementStats} />
          )}
          
          {/* Goals - Optional visibility */}
          {visibleSections.goals && (
            <GoalsCard goals={userData.goals} />
          )}
        </AnimatedContainer>
      </AnimatedContainer>

      {/* Test Mocks List */}
      <AnimatedItem>
        <TestMocksList tests={mockTests} />
      </AnimatedItem>
    </AnimatedContainer>
  );
};

// Export as both named and default export
export default ProgressDashboard;
