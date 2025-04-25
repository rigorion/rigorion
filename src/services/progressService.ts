
import { supabase } from '@/lib/supabase';
import type { UserProgressData, TimePeriod } from '@/types/progress';
import { toast } from 'sonner';

const userProgressCache = new Map<string, UserProgressData>();

// Generate fallback data when the Edge Function fails
const generateFallbackData = (userId: string): UserProgressData => {
  // Generate performance graph data for last 10 days
  const today = new Date();
  const performanceGraph = [];
  
  for (let i = 9; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0];
    
    performanceGraph.push({
      date: formattedDate,
      attempted: Math.floor(Math.random() * 30) + 10,
    });
  }

  // Generate chapter performance data
  const chapterPerformance = [
    { chapterId: '1', chapterName: 'Chapter 1', correct: 12, incorrect: 3, unattempted: 5 },
    { chapterId: '2', chapterName: 'Chapter 2', correct: 8, incorrect: 2, unattempted: 5 },
    { chapterId: '3', chapterName: 'Chapter 3', correct: 10, incorrect: 5, unattempted: 10 },
    { chapterId: '4', chapterName: 'Chapter 4', correct: 20, incorrect: 4, unattempted: 6 },
    { chapterId: '5', chapterName: 'Chapter 5', correct: 5, incorrect: 3, unattempted: 10 }
  ];

  // Generate goals data
  const goals = [
    { 
      id: '1', 
      title: 'Complete 100 Questions', 
      targetValue: 100, 
      currentValue: 75, 
      dueDate: '2024-05-01' 
    },
    { 
      id: '2', 
      title: 'Achieve 90% in Hard Questions', 
      targetValue: 90, 
      currentValue: 83, 
      dueDate: '2024-05-15' 
    },
  ];

  // Calculate totals
  const correctAnswers = 53;
  const incorrectAnswers = 21;
  const unattemptedQuestions = 56;
  const totalQuestions = correctAnswers + incorrectAnswers + unattemptedQuestions;

  return {
    userId,
    totalProgressPercent: Math.round((correctAnswers + incorrectAnswers) / totalQuestions * 100),
    correctAnswers,
    incorrectAnswers,
    unattemptedQuestions,
    questionsAnsweredToday: performanceGraph[performanceGraph.length - 1].attempted,
    streak: 7,
    averageScore: 92,
    rank: 120,
    projectedScore: 92,
    speed: 85,
    easyAccuracy: 90,
    easyAvgTime: 1.5,
    easyCompleted: 45,
    easyTotal: 50,
    mediumAccuracy: 70,
    mediumAvgTime: 2.5,
    mediumCompleted: 35,
    mediumTotal: 50,
    hardAccuracy: 83,
    hardAvgTime: 4.0,
    hardCompleted: 25,
    hardTotal: 30,
    goalAchievementPercent: 75,
    averageTime: 2.5,
    correctAnswerAvgTime: 2.0,
    incorrectAnswerAvgTime: 3.5,
    longestQuestionTime: 8.0,
    performanceGraph,
    chapterPerformance,
    goals
  };
};

export async function getUserProgressData(userId: string, period: TimePeriod = "weekly"): Promise<UserProgressData> {
  try {
    // Check cache first using a compound key that includes the period
    const cacheKey = `${userId}-${period}`;
    if (userProgressCache.has(cacheKey)) {
      return userProgressCache.get(cacheKey)!;
    }
    
    console.log(`Fetching progress data for user ${userId} with period ${period}`);
    
    try {
      // Get the current session to refresh the token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication required');
      }
      
      // Use the correct Supabase URL from environment or fallback
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://evfxcdzwmmiguzxdxktl.supabase.co";
      
      // Call the edge function with proper authorization header - make sure to use Bearer format
      const response = await fetch(`${supabaseUrl}/functions/v1/get-user-progress`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
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
      const formattedData: UserProgressData = {
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

      // Store in cache
      userProgressCache.set(cacheKey, formattedData);
      return formattedData;
    } catch (error) {
      console.error('Error fetching from edge function:', error);
      toast.error("Could not load progress data. Using sample data.");
      
      // If any error, use fallback data
      const fallbackData = generateFallbackData(userId);
      userProgressCache.set(cacheKey, fallbackData);
      return fallbackData;
    }
  } catch (error) {
    console.error('Error in getUserProgressData:', error);
    // Return fallback data for any unexpected errors
    return generateFallbackData(userId);
  }
}
