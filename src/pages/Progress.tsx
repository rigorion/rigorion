import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { TabsList, Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { ProgressDashboard } from "@/components/progress/ProgressDashboard";
import { LeaderboardData } from "@/components/progress/LeaderboardData";
import { FullPageLoader } from "@/components/progress/FullPageLoader";
import type { TimePeriod, ProgressTab } from "@/types/progress";
import { TrendingUp, Trophy } from "lucide-react";
import { ProgressNavigation } from "@/components/progress/ProgressNavigation";
import { ProgressDataProvider } from "@/components/progress/ProgressDataProvider";

// Define the VisibleSections type to match the structure
type VisibleSections = {
  totalProgress: boolean;
  performanceGraph: boolean;
  difficultyStats: boolean;
  chapterProgress: boolean;
  timeManagement: boolean;
  goals: boolean;
};

// Define course type
type Course = {
  id: string;
  name: string;
  status: 'active' | 'expired';
  expiresIn: number;
};

const DUMMY_PROGRESS = {
  userId: 'dummy',
  totalProgressPercent: 75,
  correctAnswers: 53,
  incorrectAnswers: 21,
  unattemptedQuestions: 56,
  questionsAnsweredToday: 12,
  streak: 7,
  averageScore: 92,
  rank: 120,
  projectedScore: 92,
  speed: 85,
  easyAccuracy: 90,
  easyAvgTime: 1.5,
  easyCompleted: 45,
  easyTotal: 50,
  mediumAccuracy: 70,
  mediumAvgTime: 2.5,
  mediumCompleted: 35,
  mediumTotal: 50,
  hardAccuracy: 83,
  hardAvgTime: 4.0,
  hardCompleted: 25,
  hardTotal: 30,
  goalAchievementPercent: 75,
  averageTime: 2.5,
  correctAnswerAvgTime: 2.0,
  incorrectAnswerAvgTime: 3.5,
  longestQuestionTime: 8.0,
  performanceGraph: Array.from({
    length: 10
  }, (_, i) => ({
    date: new Date(Date.now() - (9 - i) * 24 * 3600 * 1000).toISOString().slice(0, 10),
    attempted: Math.floor(Math.random() * 30) + 10
  })),
  chapterPerformance: [
    {
      chapterId: '1',
      chapterName: 'Chapter 1',
      correct: 12,
      incorrect: 3,
      unattempted: 5,
    },
    {
      chapterId: '2',
      chapterName: 'Chapter 2',
      correct: 8,
      incorrect: 2,
      unattempted: 5,
    },
    {
      chapterId: '3',
      chapterName: 'Chapter 3',
      correct: 10,
      incorrect: 5,
      unattempted: 10,
    },
    {
      chapterId: '4',
      chapterName: 'Chapter 4',
      correct: 20,
      incorrect: 4,
      unattempted: 6,
    },
    {
      chapterId: '5',
      chapterName: 'Chapter 5',
      correct: 5,
      incorrect: 3,
      unattempted: 10,
    },
    {
      chapterId: '6',
      chapterName: 'Chapter 6',
      correct: 14,
      incorrect: 1,
      unattempted: 5,
    },
    {
      chapterId: '7',
      chapterName: 'Chapter 7',
      correct: 9,
      incorrect: 6,
      unattempted: 5,
    },
    {
      chapterId: '8',
      chapterName: 'Chapter 8',
      correct: 11,
      incorrect: 3,
      unattempted: 6,
    },
    {
      chapterId: '9',
      chapterName: 'Chapter 9',
      correct: 7,
      incorrect: 4,
      unattempted: 9,
    },
    {
      chapterId: '10',
      chapterName: 'Chapter 10',
      correct: 13,
      incorrect: 2,
      unattempted: 5,
    },
    {
      chapterId: '11',
      chapterName: 'Chapter 11',
      correct: 6,
      incorrect: 3,
      unattempted: 11,
    },
    {
      chapterId: '12',
      chapterName: 'Chapter 12',
      correct: 15,
      incorrect: 5,
      unattempted: 5,
    },
    {
      chapterId: '13',
      chapterName: 'Chapter 13',
      correct: 8,
      incorrect: 7,
      unattempted: 5,
    },
    {
      chapterId: '14',
      chapterName: 'Chapter 14',
      correct: 10,
      incorrect: 4,
      unattempted: 6,
    },
    {
      chapterId: '15',
      chapterName: 'Chapter 15',
      correct: 9,
      incorrect: 3,
      unattempted: 8,
    },
  ],
  goals: [{
    id: '1',
    title: 'Complete 100 Questions',
    targetValue: 100,
    currentValue: 75,
    dueDate: '2024-05-01'
  }, {
    id: '2',
    title: 'Achieve 90% in Hard Questions',
    targetValue: 90,
    currentValue: 83,
    dueDate: '2024-05-15'
  }]
};

const Progress = () => {
  const { session } = useAuth();
  const [period, setPeriod] = useState<TimePeriod>("weekly");
  const [activeTab, setActiveTab] = useState<ProgressTab>("performance");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'GMAT Preparation', status: 'active', expiresIn: 30 },
    { id: '2', name: 'SAT Advanced', status: 'active', expiresIn: 25 },
    { id: '3', name: 'GRE Verbal', status: 'expired', expiresIn: 0 }
  ]);
  const [selectedCourse, setSelectedCourse] = useState<string>('1');
  
  const [visibleSections, setVisibleSections] = useState<VisibleSections>({
    totalProgress: true,
    // Always visible
    performanceGraph: true,
    difficultyStats: true,
    chapterProgress: true,
    timeManagement: true,
    goals: true
  });
  
  const userId = session?.user?.id;
  const isAuthenticated = !!userId;

  // Create a handler that matches the expected type
  const handleSetVisibleSections = (sections: Record<string, boolean>) => {
    setVisibleSections(prev => ({
      ...prev,
      ...sections
    }));
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mono-bg">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your progress dashboard.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen w-full bg-mono-bg">
      <main className="flex-1 bg-mono-bg">
        <header className="sticky top-0 z-50 bg-white border-b px-4 py-3">
          <ProgressNavigation 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            setPeriod={(value: TimePeriod) => setPeriod(value)}
            visibleSections={visibleSections}
            setVisibleSections={handleSetVisibleSections}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            courses={courses}
          />
        </header>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={value => setActiveTab(value as ProgressTab)} className="w-full">
          <div className="container mx-auto p-6">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg">Progress Dashboard</h1>
              </div>
              
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="performance" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="hidden sm:inline">Performance</span>
                  </TabsTrigger>
                  <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    <span className="hidden sm:inline">Leaderboard</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <TabsContent value="performance">
              <ProgressDataProvider fallbackData={DUMMY_PROGRESS} showLoadingState={true}>
                {(userData) => (
                  <ProgressDashboard 
                    period={period} 
                    type="performance" 
                    userData={userData} 
                    className="[&_path]:stroke-mono-accent [&_.recharts-area]:fill-gradient-to-b [&_.recharts-area]:from-mono-hover [&_.recharts-area]:to-mono-bg [&_.recharts-bar]:fill-gradient-to-b [&_.recharts-bar]:from-mono-text [&_.recharts-bar]:to-mono-accent [&_.recharts-line]:stroke-mono-accent" 
                    visibleSections={visibleSections} 
                  />
                )}
              </ProgressDataProvider>
            </TabsContent>
            
            <TabsContent value="leaderboard">
              {userId ? <LeaderboardData userId={userId} /> : null}
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Progress;
