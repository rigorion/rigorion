import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

/**
 * Fetch data from multiple Supabase edge functions
 */
export async function fetchProgressEndpoints() {
  const endpoints = {
    userProgress: '/functions/v1/get-user-progress',
    progress: '/functions/v1/get-progress',
    leaderboard: '/functions/v1/get-leaders-board',
    satMath: '/functions/v1/get-sat-math-questions',
    satModel: '/functions/v1/get-sat-model-question',
    interactions: '/functions/v1/log-interaction'
  };
  
  const results: Record<string, any> = {};
  let hasErrors = false;
  
  // Get base URL for Supabase
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eantvimmgdmxzwrjwrop.supabase.co';
  
  // Helper function to fetch from an endpoint with error handling
  const fetchEndpoint = async (name: string, endpoint: string) => {
    try {
      console.log(`Fetching from ${endpoint}...`);
      const response = await fetch(`${supabaseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Successfully fetched ${name} data:`, data);
      return data;
    } catch (error) {
      console.error(`Error fetching ${name}:`, error);
      hasErrors = true;
      return null;
    }
  };
  
  // Fetch from all endpoints concurrently
  const promises = Object.entries(endpoints).map(
    ([name, endpoint]) => fetchEndpoint(name, endpoint).then(data => {
      results[name] = data;
    })
  );
  
  await Promise.all(promises);
  
  if (hasErrors) {
    toast.error("Some progress data could not be loaded");
  }
  
  return results;
}

/**
 * Process the fetched data to match the format expected by the progress dashboard
 */
export function processProgressData(data: Record<string, any>) {
  const userProgressData = data.userProgress?.[0] || {};
  const progressData = data.progress || [];
  const leaderboardData = data.leaderboard || [];
  const satMathData = data.satMath || [];
  const satModelData = data.satModel || [];
  const interactionsData = data.interactions || [];
  
  // Extract chapter performance from user progress data or create from other sources
  const chapterPerformance = userProgressData.chapter_stats ? 
    Object.entries(userProgressData.chapter_stats).map(([key, value]: [string, any]) => ({
      chapterId: key,
      chapterName: `${key.charAt(0).toUpperCase()}${key.slice(1).replace('_', ' ')}`,
      correct: value.correct || 0,
      incorrect: value.incorrect || 0,
      unattempted: value.unattempted || 0
    })) : [];
  
  // Extract performance graph data for the last 15 days
  let performanceGraph = userProgressData.performance_graph || [];
  
  // Ensure we have 15 days of data points
  if (performanceGraph.length < 15) {
    const today = new Date();
    const completeGraph = [];
    
    for (let i = 14; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const formattedDate = date.toISOString().split('T')[0];
      
      // Try to find this date in the existing data
      const existingEntry = performanceGraph.find(entry => entry.date === formattedDate);
      
      if (existingEntry) {
        completeGraph.push(existingEntry);
      } else {
        // Create entry with zero attempts if no data exists
        completeGraph.push({
          date: formattedDate,
          attempted: 0
        });
      }
    }
    
    performanceGraph = completeGraph;
  } else if (performanceGraph.length > 15) {
    // Only keep the most recent 15 days
    performanceGraph = performanceGraph.slice(-15);
  }
  
  // Calculate additional metrics
  const correctAnswers = userProgressData.correct_count || 0;
  const incorrectAnswers = userProgressData.incorrect_count || 0;
  const unattemptedQuestions = userProgressData.unattempted_count || 0;
  const totalQuestions = correctAnswers + incorrectAnswers + unattemptedQuestions;
  
  // Merge all the data into the format expected by the progress components
  return {
    userId: userProgressData.user_id || "unknown",
    totalProgressPercent: userProgressData.total_progress_percent || 
      Math.round(((correctAnswers + incorrectAnswers) / (totalQuestions || 1)) * 100),
    correctAnswers,
    incorrectAnswers,
    unattemptedQuestions,
    questionsAnsweredToday: userProgressData.questions_answered_today || 0,
    streak: userProgressData.streak_days || 0,
    averageScore: userProgressData.avg_score || 0,
    rank: userProgressData.rank || 0,
    projectedScore: userProgressData.projected_score || 0,
    speed: userProgressData.speed || 0,
    easyAccuracy: (userProgressData.easy?.accuracy * 100) || 0,
    easyAvgTime: (userProgressData.easy?.avg_time / 60) || 0,
    easyCompleted: userProgressData.easy?.completed || 0,
    easyTotal: userProgressData.easy?.total || 0,
    mediumAccuracy: (userProgressData.medium?.accuracy * 100) || 0,
    mediumAvgTime: (userProgressData.medium?.avg_time / 60) || 0,
    mediumCompleted: userProgressData.medium?.completed || 0, 
    mediumTotal: userProgressData.medium?.total || 0,
    hardAccuracy: (userProgressData.hard?.accuracy * 100) || 0,
    hardAvgTime: (userProgressData.hard?.avg_time / 60) || 0,
    hardCompleted: userProgressData.hard?.completed || 0,
    hardTotal: userProgressData.hard?.total || 0,
    goalAchievementPercent: userProgressData.goal_achievement_percent || 0,
    averageTime: (userProgressData.avg_time_per_question / 60) || 0,
    correctAnswerAvgTime: (userProgressData.avg_time_correct / 60) || 0,
    incorrectAnswerAvgTime: (userProgressData.avg_time_incorrect / 60) || 0,
    longestQuestionTime: (userProgressData.longest_time / 60) || 0,
    performanceGraph,
    chapterPerformance,
    goals: (userProgressData.goals || []).map((goal: any) => ({
      id: String(goal.id || Math.random()),
      title: goal.title || '',
      targetValue: goal.target || 100,
      currentValue: goal.completed || 0,
      dueDate: goal.due_date || '2024-05-01'
    })),
    // Additional data from other endpoints
    satMathData,
    satModelData,
    interactionsData,
    progressData
  };
}
