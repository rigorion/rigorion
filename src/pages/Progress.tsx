
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getUserProgressData } from "@/services/progressService";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ProgressDashboard } from "@/components/progress/ProgressDashboard";
import { LeaderboardData } from "@/components/progress/LeaderboardData";
import { FullPageLoader } from "@/components/progress/FullPageLoader";
import { ErrorDisplay } from "@/components/progress/ErrorDisplay";
import { EmptyProgressState } from "@/components/progress/EmptyProgressState";
import type { TimePeriod, ProgressTab, UserProgressData } from "@/types/progress";
import { toast } from "sonner";

const Progress = () => {
  const { session } = useAuth();
  const [period, setPeriod] = useState<TimePeriod>("weekly");
  const [activeTab, setActiveTab] = useState<ProgressTab>("performance");

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
        return await getUserProgressData(userId, period);
      } catch (err) {
        console.error("Failed to fetch progress data", err);
        toast.error("Could not load progress data from server. Using cached data instead.");
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
    onError: (error) => {
      console.error("Progress data query error:", error);
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
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(value) => setActiveTab(value as ProgressTab)}>
          <div className="container mx-auto p-6">
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
