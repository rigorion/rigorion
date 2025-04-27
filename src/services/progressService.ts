
import { supabase } from '@/lib/supabase';
import type { UserProgressData } from '@/types/progress';
import { toast } from "sonner";

export async function getUserProgressData(userId: string, period: string = "weekly"): Promise<UserProgressData> {
  try {
    console.log(`Fetching progress data for user ${userId} with period ${period}`);
    
    // Get Supabase URL from environment
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    
    // Call the edge function directly - no need for token verification
    const response = await fetch(`${supabaseUrl}/functions/v1/get-user-progress`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error('Edge function error response:', response.status, errorMessage);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received user progress data:', data);
    
    // Format the data to match our UserProgressData interface
    return {
      userId,
      totalProgressPercent: data.total_progress_percent || 0,
      correctAnswers: data.correct_answers || 0,
      incorrectAnswers: data.incorrect_answers || 0,
      unattemptedQuestions: data.unattempted_questions || 0,
      questionsAnsweredToday: data.questions_answered_today || 0,
      streak: data.streak || 0,
      averageScore: data.average_score || 0,
      rank: data.rank || 0,
      projectedScore: data.projected_score || 0,
      speed: data.speed || 0,
      easyAccuracy: data.easy_accuracy || 0,
      easyAvgTime: data.easy_avg_time || 0,
      easyCompleted: data.easy_completed || 0,
      easyTotal: data.easy_total || 0,
      mediumAccuracy: data.medium_accuracy || 0,
      mediumAvgTime: data.medium_avg_time || 0,
      mediumCompleted: data.medium_completed || 0,
      mediumTotal: data.medium_total || 0,
      hardAccuracy: data.hard_accuracy || 0,
      hardAvgTime: data.hard_avg_time || 0,
      hardCompleted: data.hard_completed || 0,
      hardTotal: data.hard_total || 0,
      goalAchievementPercent: data.goal_achievement_percent || 0,
      averageTime: data.average_time || 0,
      correctAnswerAvgTime: data.correct_answer_avg_time || 0,
      incorrectAnswerAvgTime: data.incorrect_answer_avg_time || 0,
      longestQuestionTime: data.longest_question_time || 0,
      performanceGraph: data.performance_graph || [],
      chapterPerformance: data.chapter_performance || [],
      goals: data.goals || []
    };
  } catch (error) {
    console.error('Error fetching progress data:', error);
    toast.error("Could not load progress data. Using sample data.");
    throw error;
  }
}
