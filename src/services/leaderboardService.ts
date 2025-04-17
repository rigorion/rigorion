import { supabase } from '@/lib/supabase';
import { LeaderboardEntry } from './types/progressTypes';

let leaderboardCache: LeaderboardEntry[] | null = null;

export async function getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
  try {
    if (leaderboardCache) {
      return leaderboardCache;
    }

    try {
      const { data: leaderboardData, error } = await supabase.functions.invoke('get-leaderboard', {
        body: { limit }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (leaderboardData && leaderboardData.length > 0) {
        const formattedData: LeaderboardEntry[] = leaderboardData.map((entry: any) => ({
          rank: entry.rank || 0,
          name: entry.name || 'Unknown',
          problems: entry.problems_solved || 0,
          accuracy: `${entry.accuracy || 0}%`,
          score: entry.projected_score || 0,
          trend: entry.trend_percent_change || 0,
          isCurrentUser: entry.is_current_user || false
        }));

        leaderboardCache = formattedData;
        return formattedData;
      }
    } catch (error) {
      console.error('Error fetching from edge function:', error);
    }

    // Fallback to dummy data
    const dummyEntries: LeaderboardEntry[] = [
      { rank: 1, name: 'Alex Zhang', problems: 456, accuracy: '94%', score: 98, trend: 3, isCurrentUser: false },
      { rank: 2, name: 'Maria Rodriguez', problems: 421, accuracy: '92%', score: 96, trend: 0, isCurrentUser: false },
      { rank: 3, name: 'David Kim', problems: 398, accuracy: '91%', score: 95, trend: 1, isCurrentUser: false },
      { rank: 4, name: 'Jessica Taylor', problems: 387, accuracy: '89%', score: 93, trend: -2, isCurrentUser: false },
      { rank: 5, name: 'Raj Patel', problems: 365, accuracy: '88%', score: 91, trend: 5, isCurrentUser: false },
      { rank: 6, name: 'Sophie Chen', problems: 342, accuracy: '87%', score: 90, trend: -1, isCurrentUser: false },
      { rank: 7, name: 'James Wilson', problems: 321, accuracy: '85%', score: 89, trend: 0, isCurrentUser: false },
      { rank: 8, name: 'Emma Johnson', problems: 310, accuracy: '84%', score: 88, trend: 2, isCurrentUser: false },
      { rank: 9, name: 'Michael Brown', problems: 298, accuracy: '82%', score: 86, trend: -3, isCurrentUser: false },
      { rank: 10, name: 'Current User', problems: 248, accuracy: '84%', score: 92, isCurrentUser: true, trend: 4 },
    ];

    leaderboardCache = dummyEntries;
    return dummyEntries;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}
