
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
    // Use the rpc method with type assertion to bypass TypeScript errors
    const { data: progressData, error: progressError } = await (supabase
      .rpc('get_user_progress', { user_id_param: userId }) as any)
      .single();
    
    if (progressError) throw progressError;

    // Get chapter performance data for the user using a similar approach
    const { data: chapterData, error: chapterError } = await (supabase
      .rpc('get_chapter_progress', { user_id_param: userId }) as any);
    
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
    // Use rpc with type assertion to bypass TypeScript errors
    const { error } = await (supabase
      .rpc('upsert_user_progress', { 
        user_id_param: userId,
        data_param: data
      }) as any);
    
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
    // Use rpc with type assertion to bypass TypeScript errors
    const { error } = await (supabase
      .rpc('upsert_chapter_progress', {
        user_id_param: userId,
        chapter_id_param: chapterId,
        chapter_name_param: chapterName,
        correct_param: correct,
        incorrect_param: incorrect,
        unattempted_param: unattempted
      }) as any);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating chapter progress:', error);
    throw error;
  }
}

export async function getLeaderboard(limit: number = 10) {
  try {
    // Use rpc with type assertion to bypass TypeScript errors
    const { data, error } = await (supabase
      .rpc('get_leaderboard', { limit_param: limit }) as any);
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}
