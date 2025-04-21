
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getUserProgressData } from "@/services/progressService";
import { TabsList, Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { ProgressDashboard } from "@/components/progress/ProgressDashboard";
import { LeaderboardData } from "@/components/progress/LeaderboardData";
import { FullPageLoader } from "@/components/progress/FullPageLoader";
import { ErrorDisplay } from "@/components/progress/ErrorDisplay";
import { EmptyProgressState } from "@/components/progress/EmptyProgressState";
import { Layout } from "@/components/layout/Layout";
import type { TimePeriod, ProgressTab, UserProgressData } from "@/types/progress";
import { toast } from "sonner";
import { TrendingUp, Trophy } from "lucide-react";
import { ProgressNavigation } from "@/components/progress/ProgressNavigation";
import { supabase } from "@/lib/supabase";

// Define the VisibleSections type to match the structure
type VisibleSections = {
  totalProgress: boolean;
  performanceGraph: boolean;
  difficultyStats: boolean;
  chapterProgress: boolean;
  timeManagement: boolean;
  goals: boolean;
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
  performanceGraph: Array.from({ length: 10 }, (_, i) => ({
    date: new Date(Date.now() - (9 - i) * 24 * 3600 * 1000).toISOString().slice(0, 10),
    attempted: Math.floor(Math.random() * 30) + 10,
  })),
  chapterPerformance: [
    { chapterId: '1', chapterName: 'Chapter 1', correct: 12, incorrect: 3, unattempted: 5 },
    { chapterId: '2', chapterName: 'Chapter 2', correct: 8, incorrect: 2, unattempted: 5 },
    { chapterId: '3', chapterName: 'Chapter 3', correct: 10, incorrect: 5, unattempted: 10 },
    { chapterId: '4', chapterName: 'Chapter 4', correct: 20, incorrect: 4, unattempted: 6 },
    { chapterId: '5', chapterName: 'Chapter 5', correct: 5, incorrect: 3, unattempted: 10 }
  ],
  goals: [
    { id: '1', title: 'Complete 100 Questions', targetValue: 100, currentValue: 75, dueDate: '2024-05-01' },
    { id: '2', title: 'Achieve 90% in Hard Questions', targetValue: 90, currentValue: 83, dueDate: '2024-05-15' }
  ]
};

const Progress = () => {
  const { session } = useAuth();
  const [period, setPeriod] = useState<TimePeriod>("weekly");
  const [activeTab, setActiveTab] = useState<ProgressTab>("performance");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<VisibleSections>({
    totalProgress: true, // Always visible
    performanceGraph: true,
    difficultyStats: true,
    chapterProgress: true,
    timeManagement: true,
    goals: true
  });

  const userId = session?.user?.id;
  const isAuthenticated = !!userId;

  const { 
    data: userProgress, 
    isLoading, 
    error,
    isError,
    isFetching 
  } = useQuery<UserProgressData, Error>({
    queryKey: ['userProgress', userId, period],
    queryFn: async () => {
      if (!userId) throw new Error("Authentication required");
      try {
        // Get a fresh session to ensure we have the latest token
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !currentSession?.access_token) {
          throw new Error('Authentication required');
        }
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://eantvimmgdmxzwrjwrop.supabase.co";
        console.log("JWT Token:", currentSession.access_token);
        const res = await fetch(`${supabaseUrl}/functions/v1/get-user-progress`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${currentSession.access_token}`,
            "Content-Type": "application/json"
          }
        });
        if (!res.ok) {
          console.error(`Failed to fetch progress data: HTTP error! status: ${res.status}`);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log('Progress data received:', data);
        return await getUserProgressData(userId, period);
      } catch (err) {
        console.error("Failed to fetch progress data:", err);
        throw err;
      }
    },
    enabled: isAuthenticated,
    staleTime: 300000, // 5 minutes
    retry: (failureCount, error) => {
      return error.message !== "Authentication required" && failureCount < 2;
    },
    meta: {
      onError: (error: Error) => {
        console.error("Query error handler:", error);
        toast.error("Could not load progress data. Using sample data.");
      }
    }
  });

  // Fix: handler signature must match (sections: Record<string, boolean>) => void
  const handleSetVisibleSections = (sections: Record<string, boolean>) => {
    setVisibleSections(prev => ({
      ...prev,
      ...sections
    }));
  };

  if (isLoading && isAuthenticated) {
    return <FullPageLoader />;
  }

  if (isError && !userProgress) {
    // Provide dummy fallback on error
    return <ProgressDashboard 
      period={period}
      type={activeTab}
      userData={DUMMY_PROGRESS}
      visibleSections={visibleSections}
    />;
  }

  if ((!userProgress || Object.keys(userProgress).length === 0) && isAuthenticated) {
    // Show dummy on empty
    return <ProgressDashboard 
      period={period}
      type={activeTab}
      userData={DUMMY_PROGRESS}
      visibleSections={visibleSections}
    />;
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
            setVisibleSections={handleSetVisibleSections} // <-- fixed prop type here
          />
        </header>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(value) => setActiveTab(value as ProgressTab)} className="w-full">
          <div className="container mx-auto p-6">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-3xl font-bold">Progress Dashboard</h1>
              <TabsList>
                <TabsTrigger value="performance" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Performance</span>
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span>Leaderboard</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="performance">
              <ProgressDashboard 
                period={period}
                type="performance" 
                userData={userProgress || DUMMY_PROGRESS}
                className="[&_path]:stroke-mono-accent [&_.recharts-area]:fill-gradient-to-b [&_.recharts-area]:from-mono-hover [&_.recharts-area]:to-mono-bg [&_.recharts-bar]:fill-gradient-to-b [&_.recharts-bar]:from-mono-text [&_.recharts-bar]:to-mono-accent [&_.recharts-line]:stroke-mono-accent"
                visibleSections={visibleSections}
              />
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
