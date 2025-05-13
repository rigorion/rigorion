import { supabase } from '@/lib/supabase';
import { Question } from '@/types/QuestionInterface';
import { toast } from "sonner";
import type { UserProgressData } from '@/types/progress';

// Your actual deployed Supabase Edge Function URL
const EDGE_FUNCTION_URL = 'https://eantvimmgdmxzwrjwrop.supabase.co/functions/v1/my-function';

/**
 * Fetch progress data from endpoints
 */
export async function fetchProgressEndpoints() {
  try {
    // Get the current session for optional auth
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    const userId = session?.user?.id;
    
    if (!userId) {
      throw new Error("User not authenticated");
    }
    
    // Call the Supabase Edge Function for user progress
    const { data: progressData, error } = await supabase.functions.invoke('get-user-progress', {
      body: { userId, period: 'weekly' }
    });
    
    if (error) {
      console.error('Edge function error:', error);
      throw error;
    }
    
    console.log("Progress data from endpoint:", progressData);
    return progressData;
  } catch (error) {
    console.error('Error fetching progress data:', error);
    throw error;
  }
}

/**
 * Process the raw progress data into the format needed by the UI
 */
export function processProgressData(endpointsData: any): UserProgressData {
  try {
    // If we received an array, use the first item
    const responseData = Array.isArray(endpointsData) ? endpointsData[0] : endpointsData;
    const userId = responseData?.userId || 'unknown';
    
    return {
      userId,
      totalProgressPercent: 
        responseData?.total_progress_percent || 
        Math.round(((responseData?.correct_count + responseData?.incorrect_count) / (responseData?.total_questions || 100)) * 100) ||
        75,
      correctAnswers: responseData?.correct_count || 53,
      incorrectAnswers: responseData?.incorrect_count || 21,
      unattemptedQuestions: responseData?.unattempted_count || 56,
      questionsAnsweredToday: responseData?.questions_answered_today || 12,
      streak: responseData?.streak_days || 7,
      averageScore: responseData?.avg_score || 92,
      rank: responseData?.rank || 120,
      projectedScore: responseData?.projected_score || 92,
      speed: responseData?.speed || 85,
      easyAccuracy: responseData?.easy?.accuracy * 100 || 90,
      easyAvgTime: responseData?.easy?.avg_time / 60 || 1.5,
      easyCompleted: responseData?.easy?.completed || 45,
      easyTotal: responseData?.easy?.total || 50,
      mediumAccuracy: responseData?.medium?.accuracy * 100 || 70,
      mediumAvgTime: responseData?.medium?.avg_time / 60 || 2.5,
      mediumCompleted: responseData?.medium?.completed || 35,
      mediumTotal: responseData?.medium?.total || 50,
      hardAccuracy: responseData?.hard?.accuracy * 100 || 83,
      hardAvgTime: responseData?.hard?.avg_time / 60 || 4.0,
      hardCompleted: responseData?.hard?.completed || 25,
      hardTotal: responseData?.hard?.total || 30,
      goalAchievementPercent: responseData?.goal_achievement_percent || 75,
      averageTime: responseData?.avg_time_per_question / 60 || 2.5,
      correctAnswerAvgTime: responseData?.avg_time_correct / 60 || 2.0,
      incorrectAnswerAvgTime: responseData?.avg_time_incorrect / 60 || 3.5,
      longestQuestionTime: responseData?.longest_time / 60 || 8.0,
      performanceGraph: responseData?.performance_graph || Array.from({
        length: 10
      }, (_, i) => ({
        date: new Date(Date.now() - (9 - i) * 24 * 3600 * 1000).toISOString().slice(0, 10),
        attempted: Math.floor(Math.random() * 30) + 10
      })),
      chapterPerformance: responseData?.chapter_stats ? 
        Object.entries(responseData.chapter_stats).map(([key, value]: [string, any]) => ({
          chapterId: key,
          chapterName: `${key.charAt(0).toUpperCase()}${key.slice(1).replace('_', ' ')}`,
          correct: value.correct || 0,
          incorrect: value.incorrect || 0,
          unattempted: value.unattempted || 0
        })) : 
        Array.from({ length: 15 }, (_, i) => ({
          chapterId: String(i + 1),
          chapterName: `Chapter ${i + 1}`,
          correct: Math.floor(Math.random() * 15) + 5,
          incorrect: Math.floor(Math.random() * 7) + 1,
          unattempted: Math.floor(Math.random() * 10) + 5,
        })),
      goals: (responseData?.goals || []).map((goal: any) => ({
        id: goal.id || String(Math.random()),
        title: goal.title || '',
        targetValue: goal.target || 100,
        currentValue: goal.completed || 0,
        dueDate: goal.due_date || '2024-05-01'
      })) || [{
        id: '1',
        title: 'Complete 100 Questions',
        targetValue: 100,
        currentValue: 75,
        dueDate: '2024-05-01'
      }, {
        id: '2',
        title: 'Achieve 90% in Hard Questions',
        targetValue: 90,
        currentValue: 83,
        dueDate: '2024-05-15'
      }]
    };
  } catch (error) {
    console.error('Error processing progress data:', error);
    throw error;
  }
}

/**
 * Fetch SAT Math questions from Supabase Edge Function
 */
export async function fetchMathQuestions(): Promise<Question[]> {
  try {
    // Get the current session for optional auth
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token && {
          'Authorization': `Bearer ${session.access_token}`,
        })
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge Function failed:', errorText);
      toast({
        title: "Error loading questions",
        description: "Failed to fetch questions from the server",
        variant: "destructive",
      });
      return getSampleQuestions();
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format received");
    }

    console.log(`Loaded ${data.length} questions from Edge Function`);
    return data as Question[];
  } catch (error) {
    console.error('Fetch error:', error);
    toast({
      title: "Error loading questions",
      description: "Using fallback questions instead",
      variant: "destructive",
    });
    return getSampleQuestions();
  }
}

/**
 * Get sample questions as a fallback if Edge Function fails
 */
function getSampleQuestions(): Question[] {
  return [
    {
      id: "1",
      content: "What is the probability of rolling a prime number on a fair 20-sided die?",
      solution: "Prime numbers between 1-20: 2, 3, 5, 7, 11, 13, 17, 19 (8 primes)\n\nProbability = 8/20 = 2/5 = 40%",
      difficulty: "medium",
      chapter: "Chapter 1",
      bookmarked: false,
      examNumber: 1,
      choices: ["1/20", "2/5", "3/10", "1/4"],
      correctAnswer: "2/5",
      solutionSteps: [
        "Identify prime numbers from 1-20: 2, 3, 5, 7, 11, 13, 17, 19",
        "Count the number of prime numbers: 8",
        "Calculate probability: 8/20 = 2/5 = 40%"
      ],
      quote: {
        text: "Mathematics is the music of reason.",
        source: "James Joseph Sylvester"
      }
    },
    {
      id: "2",
      content: "What's the area of a circle with radius 5 cm?",
      solution: "Using formula A = πr²\nA = π × 5² = 25π ≈ 78.54 cm²",
      difficulty: "easy",
      chapter: "Chapter 1",
      bookmarked: false,
      examNumber: 1,
      choices: ["25π cm²", "10π cm²", "5π cm²", "100π cm²"],
      correctAnswer: "25π cm²",
      solutionSteps: [
        "Recall the formula for the area of a circle: A = πr²",
        "Substitute r = 5: A = π × 5²",
        "Calculate: A = 25π ≈ 78.54 cm²"
      ],
      quote: {
        text: "Geometry is the archetype of the beauty of the world.",
        source: "Johannes Kepler"
      }
    },
    {
      id: "3",
      content: "Solve for x: 3(x + 5) = 2x + 20",
      solution: "3x + 15 = 2x + 20\n3x - 2x = 20 - 15\nx = 5",
      difficulty: "medium",
      chapter: "Chapter 2",
      bookmarked: false,
      examNumber: 1,
      choices: ["x = 3", "x = 5", "x = 7", "x = 15"],
      correctAnswer: "x = 5",
      solutionSteps: [
        "Distribute: 3(x + 5) = 3x + 15",
        "Set equal to the right side: 3x + 15 = 2x + 20",
        "Subtract 2x from both sides: 3x - 2x + 15 = 20",
        "Simplify: x + 15 = 20",
        "Subtract 15 from both sides: x = 5"
      ],
      quote: {
        text: "Algebra is the intellectual instrument which has been created for rendering clear the quantitative aspects of the world.",
        source: "Alfred North Whitehead"
      }
    }
  ];
}
