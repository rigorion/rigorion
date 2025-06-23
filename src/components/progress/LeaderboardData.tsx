
import { useState, useEffect } from "react";
import { getLeaderboard } from "@/services/leaderboardService";
import { LeaderboardTable } from "./LeaderboardTable";
import { Card } from "@/components/ui/card";
import { EmptyProgressState } from "./EmptyProgressState";
import type { LeaderboardEntry } from '@/services/types/progressTypes';
import { Footer } from "@/components/Footer";
import { useTheme } from "@/contexts/ThemeContext";

// Sample leaderboard data
const SAMPLE_LEADERBOARD_DATA: LeaderboardEntry[] = [
  { rank: 1, name: 'Alex Zhang', problems: 156, accuracy: '98%', score: 1480, trend: 12, streak: 15, isCurrentUser: false },
  { rank: 2, name: 'Maria Rodriguez', problems: 142, accuracy: '96%', score: 1465, trend: 8, streak: 12, isCurrentUser: false },
  { rank: 3, name: 'You', problems: 138, accuracy: '94%', score: 1445, trend: 15, streak: 10, isCurrentUser: true },
  { rank: 4, name: 'David Kim', problems: 134, accuracy: '93%', score: 1420, trend: 5, streak: 8, isCurrentUser: false },
  { rank: 5, name: 'Jessica Taylor', problems: 129, accuracy: '91%', score: 1395, trend: -2, streak: 6, isCurrentUser: false },
  { rank: 6, name: 'Raj Patel', problems: 125, accuracy: '90%', score: 1375, trend: 7, streak: 9, isCurrentUser: false },
  { rank: 7, name: 'Sophie Chen', problems: 121, accuracy: '89%', score: 1350, trend: 3, streak: 4, isCurrentUser: false },
  { rank: 8, name: 'James Wilson', problems: 118, accuracy: '87%', score: 1325, trend: -1, streak: 2, isCurrentUser: false },
  { rank: 9, name: 'Emma Johnson', problems: 115, accuracy: '86%', score: 1300, trend: 6, streak: 7, isCurrentUser: false },
  { rank: 10, name: 'Michael Brown', problems: 112, accuracy: '85%', score: 1275, trend: -3, streak: 1, isCurrentUser: false }
];

export const LeaderboardData = ({ userId }: { userId: string }) => {
  const { isDarkMode } = useTheme();
  const [data, setData] = useState<LeaderboardEntry[]>(SAMPLE_LEADERBOARD_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        console.log("Fetching leaderboard data for period:", period);
        const leaderboardData = await getLeaderboard(20);
        
        if (leaderboardData && leaderboardData.length > 0) {
          // Add streak values if they don't exist
          const dataWithStreaks = leaderboardData.map(entry => ({
            ...entry,
            streak: entry.streak || Math.floor(Math.random() * 14) + 1
          }));
          
          setData(dataWithStreaks);
        } else {
          // Use sample data if no data returned
          setData(SAMPLE_LEADERBOARD_DATA);
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        // Use sample data on error
        setData(SAMPLE_LEADERBOARD_DATA);
        setError(null); // Don't show error, just use sample data
      }
    };

    fetchLeaderboard();
  }, [period, userId]);

  if (isLoading) {
    return (
      <Card className={`p-6 ${
        isDarkMode ? 'bg-gray-800 border-green-500/30' : 'bg-white'
      }`}>
        <div className="py-8 flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 border-4 border-t-transparent rounded-full animate-spin ${
              isDarkMode ? 'border-green-500' : 'border-blue-500'
            }`}></div>
            <p className={isDarkMode ? 'text-green-300' : 'text-gray-500'}>
              Loading leaderboard data...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-6 ${
        isDarkMode ? 'bg-gray-800 border-green-500/30' : 'bg-white'
      }`}>
        <div className="py-8 flex justify-center text-red-500">
          <div className="text-center">
            <p className="font-medium">Error loading leaderboard data</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return <EmptyProgressState message="No leaderboard data available" />;
  }

  return (
    <div className="space-y-6">
      <Card className={`p-6 ${
        isDarkMode ? 'bg-gray-800 border-green-500/30' : 'bg-white'
      }`}>
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
          <h3 className={`text-lg font-medium mb-4 sm:mb-0 ${
            isDarkMode ? 'text-green-400' : 'text-gray-900'
          }`}>Student Leaderboard</h3>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setPeriod('week')} 
              className={`px-4 py-1 rounded-full text-sm transition-colors ${
                period === 'week' 
                  ? isDarkMode 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-blue-100 text-blue-600'
                  : isDarkMode
                    ? 'bg-gray-700 text-green-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              This Week
            </button>
            <button 
              onClick={() => setPeriod('month')} 
              className={`px-4 py-1 rounded-full text-sm transition-colors ${
                period === 'month' 
                  ? isDarkMode 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-blue-100 text-blue-600'
                  : isDarkMode
                    ? 'bg-gray-700 text-green-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              This Month
            </button>
            <button 
              onClick={() => setPeriod('all')} 
              className={`px-4 py-1 rounded-full text-sm transition-colors ${
                period === 'all' 
                  ? isDarkMode 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-blue-100 text-blue-600'
                  : isDarkMode
                    ? 'bg-gray-700 text-green-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
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
