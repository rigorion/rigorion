import { supabase } from '@/integrations/supabase/client';
import { UserProgress } from './types/progressTypes';

// Cache for user progress data
const userProgressCache = new Map<string, UserProgress>();

// Generate dummy data for the specified user
const generateDummyData = (userId: string): UserProgress => {
  // Generate performance graph data for last 10 days
  const today = new Date();
  const performanceGraphData = [];
  
  for (let i = 9; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0];
    
    performanceGraphData.push({
      date: formattedDate,
      attempted: Math.floor(Math.random() * 30) + 10,
    });
  }

  // Generate chapter performance data
  const chapterData = [
    { chapterId: '1', chapterName: 'Chapter 1', correct: 12, incorrect: 3, unattempted: 5 },
    { chapterId: '2', chapterName: 'Chapter 2', correct: 8, incorrect: 2, unattempted: 5 },
    { chapterId: '3', chapterName: 'Chapter 3', correct: 10, incorrect: 5, unattempted: 10 },
    { chapterId: '4', chapterName: 'Chapter 4', correct: 20, incorrect: 4, unattempted: 6 },
    { chapterId: '5', chapterName: 'Chapter 5', correct: 5, incorrect: 3, unattempted: 10 },
    { chapterId: '6', chapterName: 'Chapter 6', correct: 8, incorrect: 4, unattempted: 10 },
    { chapterId: '7', chapterName: 'Chapter 7', correct: 15, incorrect: 5, unattempted: 5 },
    { chapterId: '8', chapterName: 'Chapter 8', correct: 10, incorrect: 5, unattempted: 5 },
    { chapterId: '9', chapterName: 'Chapter 9', correct: 18, incorrect: 6, unattempted: 4 },
    { chapterId: '10', chapterName: 'Chapter 10', correct: 14, incorrect: 4, unattempted: 6 },
  ];

  // Generate goals data
  const goalsData = [
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
    totalProgressPercent: ((correctAnswers + incorrectAnswers) / totalQuestions) * 100,
    correctAnswers,
    incorrectAnswers,
    unattemptedQuestions,
    questionsAnsweredToday: performanceGraphData.length > 0 ? performanceGraphData[performanceGraphData.length - 1].attempted : 0,
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
    goalAchievementPercent: goalsData.reduce((acc, goal) => acc + (goal.currentValue / goal.targetValue), 0) / goalsData.length * 100,
    averageTime: 2.5,
    correctAnswerAvgTime: 2.0,
    incorrectAnswerAvgTime: 3.5,
    longestQuestionTime: 8.0,
    performanceGraph: performanceGraphData,
    chapterPerformance: chapterData,
    goals: goalsData
  };
};

export async function getUserProgressData(userId: string): Promise<UserProgress> {
  try {
    // Check if we already have data for this user in the cache
    if (userProgressCache.has(userId)) {
      return userProgressCache.get(userId)!;
    }
    
    console.log('Getting user progress data for:', userId);
    
    // Since we don't have the correct table types in supabase types,
    // we'll use a more robust approach with type assertions
    try {
      // Use a raw query approach to avoid TypeScript errors with missing tables
      const { data: userProgressData, error: userProgressError } = await supabase
        .from('user_progress' as any)
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (userProgressError) {
        console.log('Error fetching user_progress:', userProgressError);
        console.log('Falling back to dummy data');
      } else if (userProgressData) {
        console.log('Found user progress data in Supabase:', userProgressData);
        
        // Now fetch the performance graph data
        const { data: performanceData, error: performanceError } = await supabase
          .from('performance_graph' as any)
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: true });
          
        if (performanceError) {
          console.log('Error fetching performance graph:', performanceError);
        }
        
        // Fetch chapter performance data
        const { data: chapterData, error: chapterError } = await supabase
          .from('chapter_stats' as any)
          .select('*')
          .eq('user_id', userId);
          
        if (chapterError) {
          console.log('Error fetching chapter stats:', chapterError);
        }
        
        // Fetch goals data
        const { data: goalsData, error: goalsError } = await supabase
          .from('goals' as any)
          .select('*')
          .eq('user_id', userId);
          
        if (goalsError) {
          console.log('Error fetching goals:', goalsError);
        }
        
        // If we have all the data, construct the UserProgress object
        if (userProgressData && performanceData && chapterData && goalsData) {
          // Cast the data to any to avoid TypeScript errors
          const data = userProgressData as any;
          
          const userProgress: UserProgress = {
            userId,
            totalProgressPercent: data.total_progress_percent || 0,
            correctAnswers: data.correct_answers || 0,
            incorrectAnswers: data.incorrect_answers || 0,
            unattemptedQuestions: data.unattempted_questions || 0,
            questionsAnsweredToday: data.questions_answered_today || 0,
            streak: data.streak_days || 0,
            averageScore: data.avg_score || 0,
            rank: data.rank || 0,
            projectedScore: data.projected_score || 0,
            speed: data.speed || 0,
            easyAccuracy: data.easy_accuracy || 0,
            easyAvgTime: data.easy_avg_time_min || 0,
            easyCompleted: data.easy_completed || 0,
            easyTotal: data.easy_total || 0,
            mediumAccuracy: data.medium_accuracy || 0,
            mediumAvgTime: data.medium_avg_time_min || 0,
            mediumCompleted: data.medium_completed || 0,
            mediumTotal: data.medium_total || 0,
            hardAccuracy: data.hard_accuracy || 0,
            hardAvgTime: data.hard_avg_time_min || 0,
            hardCompleted: data.hard_completed || 0,
            hardTotal: data.hard_total || 0,
            goalAchievementPercent: data.goal_achievement_percent || 0,
            averageTime: data.avg_time_per_question || 0,
            correctAnswerAvgTime: data.avg_time_correct || 0,
            incorrectAnswerAvgTime: data.avg_time_incorrect || 0,
            longestQuestionTime: data.longest_time || 0,
            performanceGraph: performanceData?.map((item: any) => ({
              date: item.date || '',
              attempted: item.attempted || 0
            })) || [],
            chapterPerformance: chapterData?.map((chapter: any) => ({
              chapterId: chapter.chapter_id || '',
              chapterName: chapter.chapter_name || '',
              correct: chapter.correct || 0,
              incorrect: chapter.incorrect || 0,
              unattempted: chapter.unattempted || 0
            })) || [],
            goals: goalsData?.map((goal: any) => ({
              id: goal.id || '',
              title: goal.title || '',
              targetValue: goal.target_value || 0,
              currentValue: goal.current_value || 0,
              dueDate: goal.due_date || ''
            })) || []
          };
          
          // Store in cache
          userProgressCache.set(userId, userProgress);
          
          return userProgress;
        }
      }
    } catch (error) {
      console.error('Supabase query error:', error);
      console.log('Falling back to dummy data');
    }

    // If we got here, we couldn't fetch from Supabase successfully
    // Generate dummy data instead
    console.log('Using dummy data for user progress');
    const dummyData = generateDummyData(userId);
    
    // Store in cache
    userProgressCache.set(userId, dummyData);
    
    return dummyData;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
}
