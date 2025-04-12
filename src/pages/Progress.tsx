
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
import { Loader2 } from "lucide-react";

const Progress = () => {
  const [period, setPeriod] = useState("weekly");
  const [type, setType] = useState("performance");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Use this specific user ID as requested
  const userId = "55fb126c-109d-4c10-96af-18edc09a81c7";
  
  const { 
    data: userProgress, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['userProgress', userId],
    queryFn: () => getUserProgressData(userId),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2 text-lg">Loading progress data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="mb-2 text-lg font-semibold text-red-700">Error Loading Progress</h2>
          <p className="text-red-600">Something went wrong while fetching your progress data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Animated Sidebar */}
      <AnimatePresence>
        {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
      </AnimatePresence>
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full bg-white shadow-md">
          <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-6">
            <ProgressNavigation 
              sidebarOpen={sidebarOpen} 
              setSidebarOpen={setSidebarOpen} 
              setPeriod={setPeriod} 
              setType={setType} 
            />
            
            {/* Controls */}
            <ProgressControls 
              period={period} 
              setPeriod={setPeriod} 
              type={type} 
              setType={setType} 
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-10 bg-white">
          {type === "leaderboard" ? 
            <LeaderboardData userId={userId} /> : 
            <ProgressDashboard 
              period={period} 
              type={type} 
              userData={userProgress}
              className={cn(
                "[&_path]:stroke-blue-600", 
                "[&_.recharts-area]:fill-gradient-to-b [&_.recharts-area]:from-blue-100 [&_.recharts-area]:to-blue-50", 
                "[&_.recharts-bar]:fill-gradient-to-b [&_.recharts-bar]:from-blue-400 [&_.recharts-bar]:to-blue-600", 
                "[&_.recharts-line]:stroke-blue-600"
              )} 
            />
          }
        </main>
      </div>
    </div>
  );
};

export default Progress;
