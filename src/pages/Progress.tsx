import { useState } from "react";
import ProgressDashboard from "@/components/progress/ProgressDashboard";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/practice/Sidebar";
import { ProgressNavigation } from "@/components/progress/ProgressNavigation";
import { ProgressControls } from "@/components/progress/ProgressControls";
import { LeaderboardData } from "@/components/progress/LeaderboardData";
import { useQuery } from "@tanstack/react-query";
import { getUserProgressData } from "@/services/progressService";
import { Loader2, BarChart3, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

const Progress = () => {
  const [period, setPeriod] = useState("weekly");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("performance");
  
  const { session } = useAuth();
  
  // Use authenticated user ID if available, otherwise use default
  const userId = session?.user?.id || "55fb126c-109d-4c10-96af-18edc09a81c7";
  
  console.log("Current user ID:", userId);
  
  const {
    data: userProgress,
    isLoading,
    error
  } = useQuery({
    queryKey: ['userProgress', userId, period],
    queryFn: () => getUserProgressData(userId),
    retry: 1,
    staleTime: 60000 // 1 minute
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mono-bg">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-mono-accent mx-auto mb-4" />
          <p className="text-xl font-medium text-mono-text">Loading your progress data...</p>
          <p className="text-mono-muted mt-2">This will just take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error loading progress data:", error);
    return (
      <div className="flex min-h-screen items-center justify-center bg-mono-bg">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="rounded-lg border border-red-200 bg-red-50 p-8 text-center max-w-md"
        >
          <h2 className="mb-3 text-2xl font-semibold text-red-700">Error Loading Progress</h2>
          <p className="text-red-600 mb-4">Something went wrong while fetching your progress data.</p>
          <p className="text-gray-700">Please try refreshing the page or contact support if the problem persists.</p>
          <pre className="mt-4 text-xs text-left bg-red-100 p-2 rounded overflow-auto">
            {error instanceof Error ? error.message : 'Unknown error'}
          </pre>
        </motion.div>
      </div>
    );
  }

  if (!userProgress) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mono-bg">
        <div className="text-center">
          <p className="text-xl font-medium text-mono-text">No progress data available</p>
          <p className="text-mono-muted mt-2">Start practicing to see your progress!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-mono-bg">
      <AnimatePresence>
        {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
      </AnimatePresence>
      
      <div className="flex-1 bg-mono-bg">
        <header className="sticky top-0 z-50 w-full bg-mono-bg/95 backdrop-blur supports-[backdrop-filter]:bg-mono-bg/60 border-b border-mono-border">
          <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-6">
            <ProgressNavigation 
              sidebarOpen={sidebarOpen} 
              setSidebarOpen={setSidebarOpen} 
              setPeriod={setPeriod} 
            />
            
            <ProgressControls 
              period={period} 
              setPeriod={setPeriod} 
            />
          </div>
        </header>

        <main className="container mx-auto p-6 md:px-8 py-10 bg-mono-bg">
          <Tabs defaultValue="performance" className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="bg-mono-hover">
                <TabsTrigger 
                  value="performance" 
                  className="data-[state=active]:bg-mono-bg data-[state=active]:text-mono-text data-[state=active]:shadow-sm px-4 py-2"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Performance
                </TabsTrigger>
                <TabsTrigger 
                  value="leaderboard" 
                  className="data-[state=active]:bg-mono-bg data-[state=active]:text-mono-text data-[state=active]:shadow-sm px-4 py-2"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Leaderboard
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="performance">
              <ProgressDashboard 
                period={period} 
                type="performance" 
                userData={userProgress} 
                className={cn(
                  "[&_path]:stroke-mono-accent", 
                  "[&_.recharts-area]:fill-gradient-to-b [&_.recharts-area]:from-mono-hover [&_.recharts-area]:to-mono-bg", 
                  "[&_.recharts-bar]:fill-gradient-to-b [&_.recharts-bar]:from-mono-text [&_.recharts-bar]:to-mono-accent", 
                  "[&_.recharts-line]:stroke-mono-accent"
                )} 
              />
            </TabsContent>
            
            <TabsContent value="leaderboard">
              <LeaderboardData userId={userId} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Progress;
