
import { useState, useEffect } from "react";
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
    isError 
  } = useQuery<UserProgressData, Error>({
    queryKey: ['userProgress', userId, period],
    queryFn: () => {
      if (!userId) throw new Error("Authentication required");
      return getUserProgressData(userId);
    },
    enabled: isAuthenticated,
    staleTime: 300000, // 5 minutes
    retry: (failureCount, error) => {
      return error.message !== "Authentication required" && failureCount < 3;
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      console.warn("User not authenticated");
    }
  }, [isAuthenticated]);

  if (isLoading && isAuthenticated) {
    return <FullPageLoader />;
  }

  if (isError) {
    return <ErrorDisplay error={error} />;
  }

  if (!userProgress && isAuthenticated) {
    return <EmptyProgressState />;
  }

  return (
    <div className="flex min-h-screen w-full bg-mono-bg">
      <main className="flex-1 bg-mono-bg">
        <Tabs defaultValue={activeTab} className="w-full">
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
