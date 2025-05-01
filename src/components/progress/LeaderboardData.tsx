
import { useState, useEffect } from "react";
import { getLeaderboard } from "@/services/leaderboardService";
import { LeaderboardTable } from "./LeaderboardTable";
import { Card } from "@/components/ui/card";
import { EmptyProgressState } from "./EmptyProgressState";
import type { LeaderboardEntry } from '@/services/types/progressTypes';
import { Footer } from "@/components/Footer";

export const LeaderboardData = ({ userId }: { userId: string }) => {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const leaderboardData = await getLeaderboard(20);
        setData(leaderboardData);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [period, userId]);

  if (isLoading) {
    return <Card className="p-6"><div className="py-8 flex justify-center">Loading leaderboard data...</div></Card>;
  }

  if (error) {
    return <Card className="p-6"><div className="py-8 flex justify-center text-red-500">Error loading leaderboard data</div></Card>;
  }

  if (data.length === 0) {
    return <EmptyProgressState message="No leaderboard data available" />;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
          <h3 className="text-lg font-medium mb-4 sm:mb-0">Student Leaderboard</h3>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setPeriod('week')} 
              className={`px-4 py-1 rounded-full text-sm ${period === 'week' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              This Week
            </button>
            <button 
              onClick={() => setPeriod('month')} 
              className={`px-4 py-1 rounded-full text-sm ${period === 'month' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              This Month
            </button>
            <button 
              onClick={() => setPeriod('all')} 
              className={`px-4 py-1 rounded-full text-sm ${period === 'all' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              All Time
            </button>
          </div>
        </div>
        
        <LeaderboardTable data={data} />
      </Card>
      
      <Footer />
    </div>
  );
};
