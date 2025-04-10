
import { supabase } from '@/integrations/supabase/client';

export interface UserProgress {
  userId: string;
  totalProgressPercent: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattemptedQuestions: number;
  questionsAnsweredToday: number;
  streak: number;
  averageScore: number;
  rank: number;
  projectedScore: number;
  speed: number;
  easyAccuracy: number;
  easyAvgTime: number;
  mediumAccuracy: number;
  mediumAvgTime: number;
  hardAccuracy: number;
  hardAvgTime: number;
  goalAchievementPercent: number;
  goalTitle: string;
  goalDueDate: string;
  targetTotalQuestions: number;
  averageTime: number;
  correctAnswerAvgTime: number;
  incorrectAnswerAvgTime: number;
  longestQuestionTime: number;
  chapterPerformance: {
    chapterId: string;
    chapterName: string;
    correct: number;
    incorrect: number;
    unattempted: number;
  }[];
}

export async function getUserProgressData(userId: string) {
  try {
    // Use the raw query method instead of the typed table access
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (progressError) throw progressError;

    // Get chapter performance data for the user
    const { data: chapterData, error: chapterError } = await supabase
      .from('chapter_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (chapterError) throw chapterError;
    
    return {
      progressData,
      chapterData,
    };
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
}

export async function updateUserProgress(
  userId: string, 
  data: Partial<Omit<UserProgress, 'userId' | 'chapterPerformance'>>
) {
  try {
    const { error } = await supabase
      .from('user_progress')
      .upsert({ 
        user_id: userId,
        ...data
      }, { onConflict: 'user_id' });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
}

export async function updateChapterProgress(
  userId: string,
  chapterId: string,
  chapterName: string,
  correct: number,
  incorrect: number,
  unattempted: number
) {
  try {
    const { error } = await supabase
      .from('chapter_progress')
      .upsert({
        user_id: userId,
        chapter_id: chapterId,
        chapter_name: chapterName,
        correct,
        incorrect,
        unattempted
      }, { onConflict: 'user_id, chapter_id' });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating chapter progress:', error);
    throw error;
  }
}

export async function getLeaderboard(limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        user_id,
        total_progress_percent,
        correct_answers,
        incorrect_answers,
        average_score,
        projected_score,
        profiles:user_id (name, avatar_url)
      `)
      .order('average_score', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}
