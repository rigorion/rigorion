
const SUPABASE_URL = "https://eantvimmgdmxzwrjwrop.supabase.co";
const API_VERSION = "v1";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProgressData } from '@/services/types/progressTypes';

/**
 * Try a direct HTTP GET to your edge function, 
 * then fall back to supabase.functions.invoke()
 */
async function fetchWithInvokeFallback(
  endpoint: string,
  authToken?: string
): Promise<any> {
  const url = `${SUPABASE_URL}/functions/${API_VERSION}/${endpoint}`;
  const headers: Record<string,string> = {
    "Content-Type": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  };

  // 1️⃣ Primary: direct fetch
  try {
    const res = await fetch(url, { method: "GET", headers });
    if (!res.ok) {
      throw new Error(`Fetch failed ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (fetchErr) {
    console.warn(`Direct fetch failed for ${endpoint}:`, fetchErr);

    // 2️⃣ Fallback: supabase.functions.invoke
    const invokeOpts = { headers: authToken ? { Authorization: `Bearer ${authToken}` } : {} };
    const { data, error } = await supabase.functions.invoke(endpoint, invokeOpts);
    if (error) {
      console.error(`Invoke fallback also failed for ${endpoint}:`, error);
      throw error;
    }
    return data;
  }
}

export async function fetchProgressEndpoints() {
  const endpoints = {
    userProgress: "get-user-progress",
    progress:     "get-progress",
    leaderboard:  "get-leaders-board",
    satMath:      "get-sat-math-questions",
    satModel:     "get-sat-model-question",
    interactions: "log-interaction",
  };

  const results: Record<string, any> = {};
  const failed: string[] = [];

  // Grab session token once
  const { data: { session } } = await supabase.auth.getSession();
  const authToken = session?.access_token;

  await Promise.all(
    Object.entries(endpoints).map(async ([key, endpoint]) => {
      try {
        results[key] = await fetchWithInvokeFallback(endpoint, authToken);
      } catch {
        failed.push(key);
        results[key] = null;
      }
    })
  );

  if (failed.length) {
    toast.error(`Failed to load: ${failed.join(", ")}`);
  }

  return results;
}

/**
 * Process all the data from multiple endpoints into a single UserProgressData object
 */
export function processProgressData(endpointsData: Record<string, any>): UserProgressData {
  console.log("Processing progress data from endpoints:", endpointsData);
  
  // Extract user progress data
  const userProgressData = endpointsData.userProgress && Array.isArray(endpointsData.userProgress) 
    ? endpointsData.userProgress[0] 
    : null;
  
  if (!userProgressData) {
    console.warn("No user progress data available, using defaults");
  }
  
  // Create performance graph with 15-day history
  let performanceGraph = [];
  if (userProgressData && userProgressData.performance_graph) {
    performanceGraph = userProgressData.performance_graph;
  } else {
    // Generate empty performance data for the last 15 days
    const today = new Date();
    for (let i = 14; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const formattedDate = date.toISOString().split('T')[0];
      performanceGraph.push({
        date: formattedDate,
        attempted: 0
      });
    }
  }
  
  // Create chapter performance data
  const chapterPerformance = [];
  if (userProgressData && userProgressData.chapter_stats) {
    Object.entries(userProgressData.chapter_stats).forEach(([chapterId, stats]: [string, any]) => {
      chapterPerformance.push({
        chapterId,
        chapterName: chapterId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        correct: stats.correct || 0,
        incorrect: stats.incorrect || 0,
        unattempted: stats.unattempted || 0
      });
    });
  }
  
  // Create goals data
  const goals = [];
  if (userProgressData && userProgressData.goals) {
    userProgressData.goals.forEach((goal: any) => {
      goals.push({
        id: Math.random().toString(),
        title: goal.title,
        targetValue: goal.target,
        currentValue: goal.completed,
        dueDate: goal.due_date
      });
    });
  }
  
  // Calculate total progress percentage
  let totalProgressPercent = 0;
  if (userProgressData) {
    const total = userProgressData.total_questions || 0;
    const attempted = userProgressData.total_attempted || 0;
    totalProgressPercent = total > 0 ? Math.round((attempted / total) * 100) : 0;
  }
  
  // Generate the final processed data - Remove the properties that don't exist in UserProgressData type
  return {
    userId: userProgressData?.user_id || "unknown",
    totalProgressPercent,
    correctAnswers: userProgressData?.correct_count || 0,
    incorrectAnswers: userProgressData?.incorrect_count || 0,
    unattemptedQuestions: userProgressData?.unattempted_count || 0,
    questionsAnsweredToday: userProgressData?.questions_answered_today || 0,
    streak: userProgressData?.streak_days || 0,
    averageScore: userProgressData?.avg_score || 0,
    rank: userProgressData?.rank || 0,
    projectedScore: userProgressData?.projected_score || 0,
    speed: userProgressData?.speed || 0,
    easyAccuracy: userProgressData?.easy?.accuracy * 100 || 0,
    easyAvgTime: userProgressData?.easy?.avg_time ? userProgressData.easy.avg_time / 60 : 0,
    easyCompleted: userProgressData?.easy?.completed || 0,
    easyTotal: userProgressData?.easy?.total || 0,
    mediumAccuracy: userProgressData?.medium?.accuracy * 100 || 0,
    mediumAvgTime: userProgressData?.medium?.avg_time ? userProgressData.medium.avg_time / 60 : 0,
    mediumCompleted: userProgressData?.medium?.completed || 0,
    mediumTotal: userProgressData?.medium?.total || 0,
    hardAccuracy: userProgressData?.hard?.accuracy * 100 || 0,
    hardAvgTime: userProgressData?.hard?.avg_time ? userProgressData.hard.avg_time / 60 : 0,
    hardCompleted: userProgressData?.hard?.completed || 0,
    hardTotal: userProgressData?.hard?.total || 0,
    goalAchievementPercent: userProgressData?.goals?.length 
      ? userProgressData.goals.reduce((acc: number, goal: any) => acc + (goal.percent || 0), 0) / userProgressData.goals.length * 100 
      : 0,
    averageTime: userProgressData?.avg_time_per_question ? userProgressData.avg_time_per_question / 60 : 0,
    correctAnswerAvgTime: userProgressData?.avg_time_correct ? userProgressData.avg_time_correct / 60 : 0,
    incorrectAnswerAvgTime: userProgressData?.avg_time_incorrect ? userProgressData.avg_time_incorrect / 60 : 0,
    longestQuestionTime: userProgressData?.longest_time ? userProgressData.longest_time / 60 : 0,
    performanceGraph,
    chapterPerformance,
    goals
  };
}
