import { supabase } from '@/lib/supabase';
import type { UserProgressData } from '@/types/progress';

export const getUserProgressData = async (userId: string): Promise<UserProgressData> => {
  try {
    const { data: userProgressData, error } = await supabase.functions.invoke('get-user-progress', {
      body: { userId }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw error;
    }

    if (!userProgressData) {
      throw new Error('No progress data found');
    }

    return userProgressData as UserProgressData;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
};

// This is a barrel file exporting all progress-related services
export { getLeaderboard } from './leaderboardService';
export type { LeaderboardEntry } from './types/progressTypes';
