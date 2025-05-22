
import { safeGetSecureData } from './secureIndexedDbService';
import { UserProgressData } from '@/types/progress';

// Define interface for chapter stats from the API response
interface ChapterStat {
  correct: number;
  accuracy: number;
  incorrect: number;
  unattempted: number;
}

// Define the difficulty level stats structure
interface DifficultyStats {
  total: number;
  accuracy: number;
  avg_time: number;
  completed: number;
}

// Define the overall progress data structure from the API
interface ProgressApiResponse {
  user_id: string;
  total_questions: number;
  correct_count: number;
  incorrect_count: number;
  unattempted_count: number;
  streak_days: number;
  avg_score: number;
  rank: number;
  projected_score: number;
  speed: number;
  easy?: DifficultyStats;
  medium?: DifficultyStats;
  hard?: DifficultyStats;
  avg_time_per_question: number;
  avg_time_correct: number;
  avg_time_incorrect: number;
  longest_time: number;
  chapter_stats: Record<string, ChapterStat>;
  goals?: Array<{
    title: string;
    target: number;
    percent: number;
    due_date: string;
    completed: number;
  }>;
  performance_graph?: Array<{
    date: string;
    attempted: number;
  }>;
}

/**
 * Fetches user progress data from secure storage and maps it to the UserProgressData format
 * used in the Progress page components
 */
export async function fetchSecureUserProgressData(): Promise<UserProgressData | null> {
  try {
    // Try to get the data from secure storage
    const { data, fromCache } = await safeGetSecureData('get-user-progress');
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('No valid progress data found in secure storage');
      return null;
    }
    
    // Log data source for debugging
    console.log(`Progress data loaded from ${fromCache ? 'local secure cache' : 'network'}`);
    
    // The edge function returns an array, take the first item
    const progressData = data[0] as ProgressApiResponse;
    
    // Map the edge function data format to our UserProgressData format
    return {
      userId: progressData.user_id || 'unknown',
      totalProgressPercent: Math.round(((progressData.correct_count + progressData.incorrect_count) / progressData.total_questions) * 100),
      correctAnswers: progressData.correct_count || 0,
      incorrectAnswers: progressData.incorrect_count || 0,
      unattemptedQuestions: progressData.unattempted_count || 0,
      questionsAnsweredToday: progressData.questions_answered_today || 0,
      streak: progressData.streak_days || 0,
      averageScore: progressData.avg_score || 0,
      rank: progressData.rank || 0,
      projectedScore: progressData.projected_score || 0,
      speed: progressData.speed * 100 || 0, // Convert decimal to percentage
      easyAccuracy: progressData.easy?.accuracy * 100 || 0,
      easyAvgTime: progressData.easy?.avg_time / 60 || 0, // Convert seconds to minutes
      easyCompleted: progressData.easy?.completed || 0,
      easyTotal: progressData.easy?.total || 0,
      mediumAccuracy: progressData.medium?.accuracy * 100 || 0,
      mediumAvgTime: progressData.medium?.avg_time / 60 || 0, // Convert seconds to minutes
      mediumCompleted: progressData.medium?.completed || 0,
      mediumTotal: progressData.medium?.total || 0,
      hardAccuracy: progressData.hard?.accuracy * 100 || 0,
      hardAvgTime: progressData.hard?.avg_time / 60 || 0, // Convert seconds to minutes
      hardCompleted: progressData.hard?.completed || 0,
      hardTotal: progressData.hard?.total || 0,
      goalAchievementPercent: progressData.goals?.reduce((sum, goal) => 
        sum + (goal.percent * 100), 0) / (progressData.goals?.length || 1) || 0,
      averageTime: progressData.avg_time_per_question / 60 || 0, // Convert seconds to minutes
      correctAnswerAvgTime: progressData.avg_time_correct / 60 || 0,
      incorrectAnswerAvgTime: progressData.avg_time_incorrect / 60 || 0,
      longestQuestionTime: progressData.longest_time / 60 || 0,
      // Format the performance graph data
      performanceGraph: progressData.performance_graph?.map(item => ({
        date: item.date,
        attempted: item.attempted
      })) || [],
      // Format the chapter performance data - Now properly typed
      chapterPerformance: Object.entries(progressData.chapter_stats || {}).map(([key, value]) => ({
        chapterId: key,
        chapterName: `Chapter ${key.split('_')[1]}`,
        correct: value.correct,
        incorrect: value.incorrect,
        unattempted: value.unattempted
      })),
      // Format the goals data
      goals: (progressData.goals || []).map((goal, index) => ({
        id: String(index + 1),
        title: goal.title,
        targetValue: goal.target,
        currentValue: goal.completed,
        dueDate: goal.due_date
      }))
    };
  } catch (error) {
    console.error('Error fetching secure user progress data:', error);
    return null;
  }
}
