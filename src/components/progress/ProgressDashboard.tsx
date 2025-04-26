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
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

  // Stats data with exam date selector
  const stats = [{
    title: "Days to Exam",
    value: `${daysToExam} days`,
    icon: Calendar,
    color: "text-purple-500",
    backgroundColor: "bg-purple-50",
    component: () => <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="w-full justify-between rounded-full text-base font-normal">
            <Calendar className="text-purple-500 mr-2" />
            <span>{daysToExam} days</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <DatePicker mode="single" selected={examDate} onSelect={setExamDate} disabled={date => date < new Date()} />
        </PopoverContent>
      </Popover>
  }, {
    title: "Streak",
    value: `${userData.streak} days`,
    icon: Zap,
    color: "text-amber-500",
    backgroundColor: "bg-amber-50"
  }, {
    title: "Avg Score",
    value: `${userData.averageScore}`,
    icon: Target,
    color: "text-emerald-500",
    backgroundColor: "bg-emerald-50"
  }, {
    title: "Rank",
    value: `#${userData.rank}`,
    icon: Trophy,
    color: "text-blue-500",
    backgroundColor: "bg-blue-50"
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
  return <AnimatedContainer className={cn("space-y-8", className)}>
      <div className="flex justify-center">
        <div className="max-w-4xl w-full">
          <StatsCardGrid stats={stats} />
        </div>
      </div>
      
      <AnimatedContainer className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnimatedItem>
          <TotalProgressCard totalQuestions={userData.correctAnswers + userData.incorrectAnswers + userData.unattemptedQuestions} correctQuestions={userData.correctAnswers} incorrectQuestions={userData.incorrectAnswers} unattemptedQuestions={userData.unattemptedQuestions} alwaysVisible={true} />
        </AnimatedItem>

        {visibleSections.performanceGraph && <AnimatedItem className="lg:col-span-2">
            <PerformanceGraphCard data={userData.performanceGraph} />
          </AnimatedItem>}
      </AnimatedContainer>

      <DifficultyStatsGrid stats={difficultyStats} />

      <AnimatedContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visibleSections.chapterProgress && <AnimatedItem>
            <Card className="p-6 bg-white border border-gray-50">
              <ChapterProgress chapters={userData.chapterPerformance} />
            </Card>
          </AnimatedItem>}

        <AnimatedItem>
          <TestMocksList tests={mockTests} />
        </AnimatedItem>
      </AnimatedContainer>

      {visibleSections.goals && <AnimatedItem>
          <GoalsCard goals={userData.goals} />
        </AnimatedItem>}

      <Footer />
    </AnimatedContainer>;
};
export default ProgressDashboard;