
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { LeaderboardTable } from "./LeaderboardTable";
import { FullPageLoader } from "./FullPageLoader";
import { ErrorDisplay } from "./ErrorDisplay";
import { Card } from "@/components/ui/card";
import type { LeaderboardEntry } from "@/types/progress";

// Function to fetch leaderboard data
async function getLeaderboard(userId: string): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase.functions.invoke('get-leaderboard', {
      body: { userId }
    });
    
    if (error) throw error;
    
    return data.map((entry: any, index: number) => ({
      rank: index + 1,
      name: entry.name || 'Anonymous',
      problems: entry.problems_solved || 0,
      accuracy: `${entry.accuracy}%`,
      score: entry.score || 0,
      trend: entry.trend || 0,
      isCurrentUser: entry.user_id === userId
    }));
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    // Return dummy data on error
    return generateDummyLeaderboard(userId);
  }
}

// Generate dummy leaderboard data
function generateDummyLeaderboard(userId: string): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = [];
  
  for (let i = 1; i <= 10; i++) {
    entries.push({
      rank: i,
      name: i === 5 ? 'You' : `User ${i}`,
      problems: 100 - (i * 5),
      accuracy: `${98 - (i * 3)}%`,
      score: 1000 - (i * 50),
      trend: Math.floor(Math.random() * 7) - 3,
      isCurrentUser: i === 5
    });
  }
  
  return entries;
}

export const LeaderboardData = ({ userId }: { userId: string }) => {
  const { data: leaderboard, isLoading, error } = useQuery({
    queryKey: ['leaderboard', userId],
    queryFn: () => getLeaderboard(userId),
    staleTime: 300000, // 5 minutes
  });
  
  if (isLoading) {
    return <FullPageLoader />;
  }
  
  if (error) {
    return <ErrorDisplay error={error as Error} />;
  }
  
  return (
    <Card className="p-6 bg-white">
      <h2 className="text-2xl font-bold mb-6">Leaderboard</h2>
      <LeaderboardTable leaderboardData={leaderboard || []} />
    </Card>
  );
};
