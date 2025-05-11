// src/services/progressService.ts

const SUPABASE_URL = "https://eantvimmgdmxzwrjwrop.supabase.co";
const API_VERSION = "v1";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProgressData } from '@/services/types/progressTypes';

// Comprehensive dummy data structure
const DUMMY_DATA: Record<string, any> = {
  userProgress: [{
    user_id: "dummy-user-123",
    total_questions: 1500,
    total_attempted: 875,
    correct_count: 645,
    incorrect_count: 230,
    unattempted_count: 625,
    questions_answered_today: 23,
    streak_days: 7,
    avg_score: 82.5,
    rank: 42,
    projected_score: 1350,
    speed: 1.8,
    easy: {
      accuracy: 0.85,
      avg_time: 45,
      completed: 320,
      total: 500
    },
    medium: {
      accuracy: 0.72,
      avg_time: 68,
      completed: 250,
      total: 600
    },
    hard: {
      accuracy: 0.55,
      avg_time: 92,
      completed: 75,
      total: 400
    },
    avg_time_per_question: 68,
    avg_time_correct: 58,
    avg_time_incorrect: 81,
    longest_time: 210,
    performance_graph: generatePerformanceGraph(),
    chapter_stats: generateChapterStats(),
    goals: [
      {
        title: "Complete 1000 Questions",
        target: 1000,
        completed: 875,
        due_date: "2024-12-31"
      }
    ]
  }],
  progress: {
    weekly_completion: 65,
    daily_target: 25,
    accuracy_improvement: 12,
    speed_improvement: 8
  },
  leaderboard: Array.from({ length: 20 }, (_, i) => ({
    rank: i + 1,
    username: `Student${i + 1}`,
    score: 1500 - (i * 65),
    avatar_url: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${i}`
  })),
  satMath: Array.from({ length: 10 }, (_, i) => ({
    question_id: i + 1,
    text: `Solve for x: ${i + 2}x + 5 = ${(i + 2) * 3 + 5}`,
    difficulty: i % 2 === 0 ? 'medium' : 'hard',
    options: Array.from({ length: 4 }, (_, j) => ({
      id: j + 1,
      value: (j === i % 4) ? 3 + i : Math.floor(Math.random() * 10) + 1
    }))
  })),
  satModel: {
    question_id: 0,
    text: "A train travels 300 miles in 5 hours. If it continues at the same speed, how far will it travel in 7 hours?",
    difficulty: "medium",
    options: [
      { id: 1, value: 380 },
      { id: 2, value: 420 },
      { id: 3, value: 400 },
      { id: 4, value: 410 }
    ],
    correct_answer: 2
  },
  interactions: { status: "logged", timestamp: new Date().toISOString() }
};

function generatePerformanceGraph() {
  const today = new Date();
  return Array.from({ length: 15 }, (_, i) => ({
    date: new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0],
    attempted: Math.floor(Math.random() * 20) + 10
  })).reverse();
}

function generateChapterStats() {
  return Array.from({ length: 10 }, (_, i) => ({
    [`chapter_${i + 1}`]: {
      correct: Math.floor(Math.random() * 50) + 20,
      incorrect: Math.floor(Math.random() * 20) + 5,
      unattempted: Math.floor(Math.random() * 30) + 10
    }
  })).reduce((acc, curr) => ({ ...acc, ...curr }), {});
}

async function fetchDirect(endpoint: string, authToken?: string): Promise<any> {
  const url = `${SUPABASE_URL}/functions/${API_VERSION}/${endpoint}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` })
  };

  try {
    const res = await fetch(url, {
      method: "GET",
      headers,
      credentials: "omit",
      mode: "cors"
    });

    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.warn(`Direct fetch failed for ${endpoint}:`, error);
    return null;
  }
}

export async function fetchProgressEndpoints() {
  const endpoints = {
    userProgress: "get-user-progress",
    progress: "get-progress",
    leaderboard: "get-leaders-board",
    satMath: "get-sat-math-questions",
    satModel: "get-sat-model-question",
    interactions: "log-interaction",
  };

  const results: Record<string, any> = {};
  const failed: string[] = [];

  const { data: { session } } = await supabase.auth.getSession();
  const authToken = session?.access_token;

  await Promise.all(
    Object.entries(endpoints).map(async ([key, endpoint]) => {
      try {
        const apiData = await fetchDirect(endpoint, authToken);
        results[key] = apiData ?? DUMMY_DATA[key];
        if (!apiData) failed.push(key);
      } catch (error) {
        results[key] = DUMMY_DATA[key];
        failed.push(key);
      }
    })
  );

  if (failed.length) {
    toast.warning(`Using demo data for: ${failed.join(", ")}`);
  }

  return results;
}

export function processProgressData(endpointsData: Record<string, any>): UserProgressData {
  const userProgressData = endpointsData.userProgress?.[0] || DUMMY_DATA.userProgress[0];
  const progressData = endpointsData.progress || DUMMY_DATA.progress;
  
  // Performance graph processing
  const performanceGraph = userProgressData.performance_graph?.map((entry: any) => ({
    date: entry.date,
    attempted: entry.attempted
  })) || DUMMY_DATA.userProgress[0].performance_graph;

  // Chapter performance processing
  const chapterPerformance = Object.entries(userProgressData.chapter_stats || {})
    .map(([chapterId, stats]: [string, any]) => ({
      chapterId,
      chapterName: `Chapter ${chapterId.split('_')[1]}`,
      correct: stats.correct || 0,
      incorrect: stats.incorrect || 0,
      unattempted: stats.unattempted || 0
    }));

  // Goals processing
  const goals = (userProgressData.goals || []).map((goal: any) => ({
    id: `goal-${Math.random().toString(36).substr(2, 9)}`,
    title: goal.title,
    targetValue: goal.target,
    currentValue: goal.completed,
    dueDate: goal.due_date
  }));

  // Calculate derived values
  const totalProgressPercent = userProgressData.total_attempted && userProgressData.total_questions
    ? Math.round((userProgressData.total_attempted / userProgressData.total_questions) * 100)
    : 58;

  const goalAchievementPercent = goals.length
    ? goals.reduce((sum: number, goal: any) => 
        sum + (goal.currentValue / goal.targetValue * 100), 0) / goals.length
    : 0;

  return {
    userId: userProgressData.user_id,
    totalProgressPercent,
    correctAnswers: userProgressData.correct_count,
    incorrectAnswers: userProgressData.incorrect_count,
    unattemptedQuestions: userProgressData.unattempted_count,
    questionsAnsweredToday: userProgressData.questions_answered_today,
    streak: userProgressData.streak_days,
    averageScore: userProgressData.avg_score,
    rank: userProgressData.rank,
    projectedScore: userProgressData.projected_score,
    speed: userProgressData.speed,
    easyAccuracy: userProgressData.easy.accuracy * 100,
    easyAvgTime: userProgressData.easy.avg_time / 60,
    easyCompleted: userProgressData.easy.completed,
    easyTotal: userProgressData.easy.total,
    mediumAccuracy: userProgressData.medium.accuracy * 100,
    mediumAvgTime: userProgressData.medium.avg_time / 60,
    mediumCompleted: userProgressData.medium.completed,
    mediumTotal: userProgressData.medium.total,
    hardAccuracy: userProgressData.hard.accuracy * 100,
    hardAvgTime: userProgressData.hard.avg_time / 60,
    hardCompleted: userProgressData.hard.completed,
    hardTotal: userProgressData.hard.total,
    goalAchievementPercent,
    averageTime: userProgressData.avg_time_per_question / 60,
    correctAnswerAvgTime: userProgressData.avg_time_correct / 60,
    incorrectAnswerAvgTime: userProgressData.avg_time_incorrect / 60,
    longestQuestionTime: userProgressData.longest_time / 60,
    performanceGraph,
    chapterPerformance: chapterPerformance.length ? chapterPerformance : DUMMY_DATA.userProgress[0].chapter_stats,
    goals: goals.length ? goals : DUMMY_DATA.userProgress[0].goals,
    ...progressData
  };
}
