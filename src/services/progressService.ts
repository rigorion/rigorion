
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
  easyCompleted: number;
  easyTotal: number;
  mediumAccuracy: number;
  mediumAvgTime: number;
  mediumCompleted: number;
  mediumTotal: number;
  hardAccuracy: number;
  hardAvgTime: number;
  hardCompleted: number;
  hardTotal: number;
  goalAchievementPercent: number;
  averageTime: number;
  correctAnswerAvgTime: number;
  incorrectAnswerAvgTime: number;
  longestQuestionTime: number;
  performanceGraph: {
    date: string;
    attempted: number;
  }[];
  chapterPerformance: {
    chapterId: string;
    chapterName: string;
    correct: number;
    incorrect: number;
    unattempted: number;
  }[];
  goals: {
    id: string;
    title: string;
    targetValue: number;
    currentValue: number;
    dueDate: string;
  }[];
}

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

// Cache for user progress data
const userProgressCache = new Map<string, UserProgress>();

export async function getUserProgressData(userId: string): Promise<UserProgress> {
  try {
    // Check if we already have data for this user in the cache
    if (userProgressCache.has(userId)) {
      return userProgressCache.get(userId)!;
    }
    
    console.log('Getting user progress data for:', userId);
    
    // Try to fetch data from Supabase (this is for future implementation)
    // Temporarily using dummy data because Supabase tables don't exist yet
    try {
      // We need to check if the Supabase database has the required tables
      const { data: tableInfo, error } = await supabase
        .from('questions')
        .select('id')
        .limit(1);
      
      console.log('Table check result:', tableInfo, error);
      
      // If we can connect to Supabase but don't have the required tables,
      // we should log that information for debugging
      if (error) {
        console.log('Error checking tables:', error);
      } else {
        console.log('Connected to Supabase, but using dummy data for now');
      }
    } catch (error) {
      console.log('Table check failed:', error);
    }

    // Generate dummy data for now
    // In a real implementation, you would fetch this data from your Supabase tables
    const dummyData = generateDummyData(userId);
    
    // Store in cache
    userProgressCache.set(userId, dummyData);
    
    return dummyData;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
}

// Cache for leaderboard data
let leaderboardCache: any[] | null = null;

export async function getLeaderboard(limit: number = 10): Promise<any[]> {
  try {
    // Return cached data if available
    if (leaderboardCache) {
      return leaderboardCache;
    }

    // Try to fetch from Supabase (for future implementation)
    // Currently will use dummy data
    
    // Generate dummy leaderboard data
    const dummyEntries = [
      { rank: 1, name: 'Alex Zhang', problems: 456, accuracy: '94%', score: 98, trend: 3, isCurrentUser: false },
      { rank: 2, name: 'Maria Rodriguez', problems: 421, accuracy: '92%', score: 96, trend: 0, isCurrentUser: false },
      { rank: 3, name: 'David Kim', problems: 398, accuracy: '91%', score: 95, trend: 1, isCurrentUser: false },
      { rank: 4, name: 'Jessica Taylor', problems: 387, accuracy: '89%', score: 93, trend: -2, isCurrentUser: false },
      { rank: 5, name: 'Raj Patel', problems: 365, accuracy: '88%', score: 91, trend: 5, isCurrentUser: false },
      { rank: 6, name: 'Sophie Chen', problems: 342, accuracy: '87%', score: 90, trend: -1, isCurrentUser: false },
      { rank: 7, name: 'James Wilson', problems: 321, accuracy: '85%', score: 89, trend: 0, isCurrentUser: false },
      { rank: 8, name: 'Emma Johnson', problems: 310, accuracy: '84%', score: 88, trend: 2, isCurrentUser: false },
      { rank: 9, name: 'Michael Brown', problems: 298, accuracy: '82%', score: 86, trend: -3, isCurrentUser: false },
      { rank: 10, name: 'Current User', problems: 248, accuracy: '84%', score: 92, isCurrentUser: true, trend: 4 },
    ];
    
    // Replace a random entry with the current user, but ensure they're in the list
    const currentUserEntry = dummyEntries.find(entry => entry.isCurrentUser);
    if (!currentUserEntry) {
      const randomIndex = Math.floor(Math.random() * dummyEntries.length);
      dummyEntries[randomIndex].name = 'Current User';
      dummyEntries[randomIndex].isCurrentUser = true;
    }
    
    // Store in cache
    leaderboardCache = dummyEntries;
    
    return dummyEntries;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}
