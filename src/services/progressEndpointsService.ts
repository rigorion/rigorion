
import { supabase } from '@/lib/supabase';
import { Question } from '@/types/QuestionInterface';
import { toast } from "@/hooks/use-toast";
import type { UserProgressData } from '@/types/progress';

// Your actual deployed Supabase Edge Function URL
const EDGE_FUNCTION_URL = 'https://eantvimmgdmxzwr.supabase.co/functions/v1/my-function';

// Define all endpoints
const endpoints = [
  { name: 'get-progress' },
  { name: 'log-interaction', method: 'POST' as const, body: { type: 'viewed', questionId: 101 } },
  { name: 'get-sat-math-questions' },
  { name: 'get-user-progress', body: { period: 'weekly' } },
  { name: 'get-apijson' },
  { name: 'my-function', body: { name: 'Functions' } },
];

// Fetch progress data from all endpoints
export async function fetchProgressEndpoints() {
  try {
    const results = await Promise.all(
      endpoints.map(async ({ name, method = 'GET' as const, body }) => {
        const { data, error } = await supabase.functions.invoke(name, {
          method,
          ...(body ? { body } : {}),
        });

        if (error) {
          console.error(`Error fetching endpoint ${name}:`, error);
          throw error;
        }

        return {
          name,
          data,
          error: null
        };
      })
    );

    console.log("Progress endpoints data:", results);
    return results;
  } catch (error) {
    console.error("Error fetching progress endpoints:", error);
    throw error;
  }
}

// Process the raw data from endpoints into a structured UserProgressData object
export function processProgressData(endpointsData: any[]): UserProgressData {
  // This is a mock implementation - in a real scenario, you would transform
  // the data from the endpoints into the UserProgressData structure
  
  // Log the received data for debugging
  console.log("Processing data:", endpointsData);
  
  // For now, return a default structure with some sample data
  // In a real implementation, you would extract and transform data from endpointsData
  return {
    userId: 'current-user',
    totalProgressPercent: 65,
    correctAnswers: 48,
    incorrectAnswers: 18,
    unattemptedQuestions: 34,
    questionsAnsweredToday: 8,
    streak: 5,
    averageScore: 85,
    rank: 145,
    projectedScore: 88,
    speed: 78,
    easyAccuracy: 92,
    easyAvgTime: 1.2,
    easyCompleted: 40,
    easyTotal: 45,
    mediumAccuracy: 75,
    mediumAvgTime: 2.3,
    mediumCompleted: 30,
    mediumTotal: 40,
    hardAccuracy: 65,
    hardAvgTime: 3.8,
    hardCompleted: 20,
    hardTotal: 35,
    goalAchievementPercent: 70,
    averageTime: 2.3,
    correctAnswerAvgTime: 1.8,
    incorrectAnswerAvgTime: 3.2,
    longestQuestionTime: 7.5,
    performanceGraph: Array.from({
      length: 10
    }, (_, i) => ({
      date: new Date(Date.now() - (9 - i) * 24 * 3600 * 1000).toISOString().slice(0, 10),
      attempted: Math.floor(Math.random() * 20) + 5
    })),
    chapterPerformance: [
      {
        chapterId: '1',
        chapterName: 'Chapter 1',
        correct: 10,
        incorrect: 2,
        unattempted: 3,
      },
      {
        chapterId: '2',
        chapterName: 'Chapter 2',
        correct: 8,
        incorrect: 3,
        unattempted: 4,
      },
      {
        chapterId: '3',
        chapterName: 'Chapter 3',
        correct: 12,
        incorrect: 4,
        unattempted: 6,
      },
    ],
    goals: [{
      id: '1',
      title: 'Complete 50 Questions',
      targetValue: 50,
      currentValue: 35,
      dueDate: '2024-06-01'
    }, {
      id: '2',
      title: 'Achieve 85% in Hard Questions',
      targetValue: 85,
      currentValue: 65,
      dueDate: '2024-06-15'
    }]
  };
}

