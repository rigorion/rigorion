
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { LeaderboardTable } from "./LeaderboardTable";
import { FullPageLoader } from "./FullPageLoader";
import { ErrorDisplay } from "./ErrorDisplay";
import { Card } from "@/components/ui/card";
import type { LeaderboardEntry } from "@/types/progress";
import { toast } from "sonner";

// Function to fetch leaderboard data
async function getLeaderboard(userId: string): Promise<LeaderboardEntry[]> {
  try {
    // First get a fresh access token
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error("Error fetching session:", sessionError);
      throw new Error("Authentication error");
    }
    
    const accessToken = session.access_token;
    
    // Call the edge function with the correct URL format
    const response = await fetch(`${Deno.env.SUPABASE_URL}/functions/v1/get-leaderboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({ userId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch leaderboard: ${response.status} - ${errorText}`);
      throw new Error(`Failed to fetch leaderboard: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map((entry: any, index: number) => ({
      rank: index + 1,
      name: entry.name || 'Anonymous',
      problems: entry.problems_solved || 0,
      accuracy: `${entry.accuracy || 0}%`,
      score: entry.score || 0,
      trend: entry.trend || 0,
      isCurrentUser: entry.user_id === userId
    }));
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    toast.error("Failed to load leaderboard data. Using sample data.");
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
  const { 
    data: leaderboard, 
    isLoading, 
    error,
    isError 
  } = useQuery<LeaderboardEntry[], Error>({
    queryKey: ['leaderboard', userId],
    queryFn: () => getLeaderboard(userId),
    staleTime: 300000, // 5 minutes
  });
  
  if (isLoading) {
    return <FullPageLoader />;
  }
  
  if (isError) {
    return <ErrorDisplay error={error} />;
  }
  
  return (
    <Card className="p-6 bg-white">
      <h2 className="text-2xl font-bold mb-6">Leaderboard</h2>
      <LeaderboardTable users={leaderboard || []} />
    </Card>
  );
};
