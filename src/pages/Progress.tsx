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
import { motion } from "framer-motion";
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
    queryKey: ['userProgress', userId, period],
    queryFn: () => getUserProgressData(userId)
  });
  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-xl font-medium text-gray-700">Loading your progress data...</p>
          <p className="text-gray-500 mt-2">This will just take a moment</p>
        </div>
      </div>;
  }
  if (error) {
    return <div className="flex min-h-screen items-center justify-center bg-white">
        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} className="rounded-lg border border-red-200 bg-red-50 p-8 text-center max-w-md">
          <h2 className="mb-3 text-2xl font-semibold text-red-700">Error Loading Progress</h2>
          <p className="text-red-600 mb-4">Something went wrong while fetching your progress data.</p>
          <p className="text-gray-700">Please try refreshing the page or contact support if the problem persists.</p>
          <pre className="mt-4 text-xs text-left bg-red-100 p-2 rounded overflow-auto">
            {error instanceof Error ? error.message : 'Unknown error'}
          </pre>
        </motion.div>
      </div>;
  }
  return <div className="flex min-h-screen w-full bg-[#F1F0FB]">
      {/* Animated Sidebar */}
      <AnimatePresence>
        {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
      </AnimatePresence>
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full bg-white shadow-md">
          <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-6">
            <ProgressNavigation sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setPeriod={setPeriod} setType={setType} />
            
            {/* Controls */}
            <ProgressControls period={period} setPeriod={setPeriod} type={type} setType={setType} />
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto p-6 md:px-8 py-10 bg-white">
          {type === "leaderboard" ? <LeaderboardData userId={userId} /> : <ProgressDashboard period={period} type={type} userData={userProgress} className={cn(
        // Use a purple theme for charts
        "[&_path]:stroke-purple-600", "[&_.recharts-area]:fill-gradient-to-b [&_.recharts-area]:from-purple-100 [&_.recharts-area]:to-purple-50", "[&_.recharts-bar]:fill-gradient-to-b [&_.recharts-bar]:from-purple-400 [&_.recharts-bar]:to-purple-600", "[&_.recharts-line]:stroke-purple-600")} />}
        </main>
      </div>
    </div>;
};
export default Progress;