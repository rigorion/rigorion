
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
        
        // Use environment variable for Supabase URL
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://eantvimmgdmxzwrjwrop.supabase.co";
        
        // Log token for debugging
        console.log("JWT Token:", currentSession.access_token);
        
        // Call the edge function with the proper JWT token
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
        
        // Return the user progress data from the service
        return await getUserProgressData(userId, period);
      } catch (err) {
        console.error("Failed to fetch progress data:", err);
        throw err;
      }
    },
    enabled: isAuthenticated,
    staleTime: 300000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry authentication errors, but retry other errors up to 2 times
      return error.message !== "Authentication required" && failureCount < 2;
    },
    meta: {
      onError: (error: Error) => {
        console.error("Query error handler:", error);
        toast.error("Could not load progress data. Using sample data.");
      }
    }
  });

  // Create a handler function to update visibleSections that matches the expected prop type
  const handleSetVisibleSections = (sections: Record<string, boolean>) => {
    // Ensure we preserve any fields in visibleSections that aren't in sections
    setVisibleSections(prevSections => ({
      ...prevSections,
      ...sections
    }));
  };

  if (isLoading && isAuthenticated) {
    return <FullPageLoader />;
  }

  if (isError && !userProgress) {
    return <ErrorDisplay error={error} />;
  }

  if (!userProgress && isAuthenticated) {
    return <EmptyProgressState />;
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
                userData={userProgress!}
                className="[&_path]:stroke-mono-accent [&_.recharts-area]:fill-gradient-to-b [&_.recharts-area]:from-mono-hover [&_.recharts-area]:to-mono-bg [&_.recharts-bar]:fill-gradient-to-b [&_.recharts-bar]:from-mono-text [&_.recharts-bar]:to-mono-accent [&_.recharts-line]:stroke-mono-accent"
                visibleSections={visibleSections}
              />
            </TabsContent>
            
            <TabsContent value="leaderboard">
              <LeaderboardData userId={userId!} />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Progress;
