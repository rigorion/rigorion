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

const Progress = () => {
  const { session } = useAuth();
  const [period, setPeriod] = useState<TimePeriod>("weekly");
  const [activeTab, setActiveTab] = useState<ProgressTab>("performance");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !currentSession?.access_token) {
          throw new Error('Authentication required');
        }

        const res = await fetch(`https://eantvimmgdmxzwrjwrop.supabase.co/functions/v1/get-user-progress`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${currentSession.access_token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Progress data received:', data);
        
        if (data) {
          return await getUserProgressData(userId, period);
        }
        
        throw new Error('No data received from progress endpoint');
      } catch (err) {
        console.error("Failed to fetch progress data:", err);
        // Re-throw to be handled by error boundary
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
      }
    }
  });

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
            setPeriod={setPeriod}
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
