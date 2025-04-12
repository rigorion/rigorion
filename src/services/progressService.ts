
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

// Create the necessary tables using SQL
const createTables = async () => {
  // Create questions table
  const { error: questionsError } = await supabase.rpc('execute_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS questions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        exam_id UUID NOT NULL,
        chapter_id UUID NOT NULL,
        difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
  
  if (questionsError) console.error('Error creating questions table:', questionsError);

  // Create objectives table
  const { error: objectivesError } = await supabase.rpc('execute_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS objectives (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        title TEXT NOT NULL,
        chapter_id UUID NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        reset_at TIMESTAMP WITH TIME ZONE
      );
    `
  });
  
  if (objectivesError) console.error('Error creating objectives table:', objectivesError);

  // Create user_question_interactions table
  const { error: interactionsError } = await supabase.rpc('execute_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS user_question_interactions (
        user_id UUID NOT NULL,
        question_id UUID NOT NULL,
        objective_id UUID,
        is_marked_for_review BOOLEAN DEFAULT false,
        is_correct BOOLEAN,
        time_spent_sec INTEGER NOT NULL,
        attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (user_id, question_id, attempted_at)
      );
    `
  });
  
  if (interactionsError) console.error('Error creating user_question_interactions table:', interactionsError);

  // Create user_progress table
  const { error: progressError } = await supabase.rpc('execute_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS user_progress (
        user_id UUID PRIMARY KEY,
        speed INTEGER,
        streak_days INTEGER,
        avg_score NUMERIC,
        rank INTEGER,
        projected_score NUMERIC,
        total_attempted INTEGER,
        total_questions INTEGER,
        correct_count INTEGER,
        incorrect_count INTEGER,
        unattempted_count INTEGER,
        easy_accuracy NUMERIC,
        easy_avg_time_min NUMERIC,
        easy_completed INTEGER,
        easy_total INTEGER,
        medium_accuracy NUMERIC,
        medium_avg_time_min NUMERIC,
        medium_completed INTEGER,
        medium_total INTEGER,
        hard_accuracy NUMERIC,
        hard_avg_time_min NUMERIC,
        hard_completed INTEGER,
        hard_total INTEGER,
        avg_time_per_question NUMERIC,
        avg_time_correct NUMERIC,
        avg_time_incorrect NUMERIC,
        longest_time NUMERIC,
        last_question_id UUID,
        active_objective_id UUID
      );
    `
  });
  
  if (progressError) console.error('Error creating user_progress table:', progressError);

  // Create chapter_stats table
  const { error: chapterStatsError } = await supabase.rpc('execute_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS chapter_stats (
        user_id UUID REFERENCES user_progress(user_id),
        chapter_id UUID NOT NULL,
        chapter_name TEXT NOT NULL,
        correct INTEGER DEFAULT 0,
        incorrect INTEGER DEFAULT 0,
        unattempted INTEGER DEFAULT 0,
        PRIMARY KEY (user_id, chapter_id)
      );
    `
  });
  
  if (chapterStatsError) console.error('Error creating chapter_stats table:', chapterStatsError);

  // Create goals table
  const { error: goalsError } = await supabase.rpc('execute_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS goals (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES user_progress(user_id),
        title TEXT NOT NULL,
        target_value INTEGER NOT NULL,
        current_value INTEGER DEFAULT 0,
        due_date TIMESTAMP WITH TIME ZONE
      );
    `
  });
  
  if (goalsError) console.error('Error creating goals table:', goalsError);

  // Create performance_graph table
  const { error: graphError } = await supabase.rpc('execute_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS performance_graph (
        user_id UUID REFERENCES user_progress(user_id),
        date DATE NOT NULL,
        attempted INTEGER DEFAULT 0,
        PRIMARY KEY (user_id, date)
      );
    `
  });
  
  if (graphError) console.error('Error creating performance_graph table:', graphError);

  // Create community_stats table
  const { error: communityStatsError } = await supabase.rpc('execute_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS community_stats (
        question_id UUID PRIMARY KEY,
        total_attempts INTEGER DEFAULT 0,
        correct_count INTEGER DEFAULT 0,
        incorrect_count INTEGER DEFAULT 0,
        avg_time_spent_sec NUMERIC DEFAULT 0
      );
    `
  });
  
  if (communityStatsError) console.error('Error creating community_stats table:', communityStatsError);

  // Create leaderboard_entries table
  const { error: leaderboardError } = await supabase.rpc('execute_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS leaderboard_entries (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        problems_solved INTEGER DEFAULT 0,
        accuracy NUMERIC DEFAULT 0,
        projected_score NUMERIC DEFAULT 0,
        trend_percent_change NUMERIC DEFAULT 0,
        duration TEXT CHECK (duration IN ('daily', 'weekly', 'monthly')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
  
  if (leaderboardError) console.error('Error creating leaderboard_entries table:', leaderboardError);
};

// Insert dummy data for the specified user
const insertDummyData = async (userId: string) => {
  // Insert user progress data
  const { error: progressError } = await supabase
    .from('user_progress')
    .upsert([{
      user_id: userId,
      speed: 85,
      streak_days: 7,
      avg_score: 92,
      rank: 120,
      projected_score: 92,
      total_attempted: 130,
      total_questions: 130,
      correct_count: 53,
      incorrect_count: 21,
      unattempted_count: 56,
      easy_accuracy: 90,
      easy_avg_time_min: 1.5,
      easy_completed: 45,
      easy_total: 50,
      medium_accuracy: 70,
      medium_avg_time_min: 2.5,
      medium_completed: 35,
      medium_total: 50,
      hard_accuracy: 83,
      hard_avg_time_min: 4.0,
      hard_completed: 25,
      hard_total: 30,
      avg_time_per_question: 2.5,
      avg_time_correct: 2.0,
      avg_time_incorrect: 3.5,
      longest_time: 8.0,
    }]);
  
  if (progressError) console.error('Error inserting user progress data:', progressError);

  // Insert chapter stats
  const chapterData = [
    { chapter_id: '1', chapter_name: 'Chapter 1', correct: 12, incorrect: 3, unattempted: 5 },
    { chapter_id: '2', chapter_name: 'Chapter 2', correct: 8, incorrect: 2, unattempted: 5 },
    { chapter_id: '3', chapter_name: 'Chapter 3', correct: 10, incorrect: 5, unattempted: 10 },
    { chapter_id: '4', chapter_name: 'Chapter 4', correct: 20, incorrect: 4, unattempted: 6 },
    { chapter_id: '5', chapter_name: 'Chapter 5', correct: 5, incorrect: 3, unattempted: 10 },
    { chapter_id: '6', chapter_name: 'Chapter 6', correct: 8, incorrect: 4, unattempted: 10 },
    { chapter_id: '7', chapter_name: 'Chapter 7', correct: 15, incorrect: 5, unattempted: 5 },
    { chapter_id: '8', chapter_name: 'Chapter 8', correct: 10, incorrect: 5, unattempted: 5 },
    { chapter_id: '9', chapter_name: 'Chapter 9', correct: 18, incorrect: 6, unattempted: 4 },
    { chapter_id: '10', chapter_name: 'Chapter 10', correct: 14, incorrect: 4, unattempted: 6 },
  ];

  for (const chapter of chapterData) {
    const { error } = await supabase
      .from('chapter_stats')
      .upsert([{
        user_id: userId,
        ...chapter
      }]);
    
    if (error) console.error(`Error inserting chapter stats for ${chapter.chapter_name}:`, error);
  }

  // Insert goals
  const goalsData = [
    { title: 'Complete 100 Questions', target_value: 100, current_value: 75, due_date: '2024-05-01' },
    { title: 'Achieve 90% in Hard Questions', target_value: 90, current_value: 83, due_date: '2024-05-15' },
  ];

  for (const goal of goalsData) {
    const { error } = await supabase
      .from('goals')
      .insert([{
        user_id: userId,
        ...goal
      }]);
    
    if (error) console.error(`Error inserting goal ${goal.title}:`, error);
  }

  // Insert performance graph data for last 10 days
  const today = new Date();
  
  for (let i = 9; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0];
    
    const { error } = await supabase
      .from('performance_graph')
      .upsert([{
        user_id: userId,
        date: formattedDate,
        attempted: Math.floor(Math.random() * 30) + 10,
      }]);
    
    if (error) console.error(`Error inserting performance graph data for ${formattedDate}:`, error);
  }

  // Insert leaderboard entry
  const { error: leaderboardError } = await supabase
    .from('leaderboard_entries')
    .insert([{
      user_id: userId,
      problems_solved: 248,
      accuracy: 84,
      projected_score: 92,
      trend_percent_change: 4,
      duration: 'weekly',
    }]);
  
  if (leaderboardError) console.error('Error inserting leaderboard entry:', leaderboardError);
};

export async function getUserProgressData(userId: string) {
  try {
    // Check if tables exist, and create them if they don't
    await createTables();
    
    // Check if user data exists, and insert dummy data if it doesn't
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('user_id')
      .eq('user_id', userId)
      .single();
    
    if (!existingProgress) {
      await insertDummyData(userId);
    }
    
    // Fetch user progress data
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (progressError) throw progressError;

    // Fetch chapter stats
    const { data: chapterData, error: chapterError } = await supabase
      .from('chapter_stats')
      .select('*')
      .eq('user_id', userId);
    
    if (chapterError) throw chapterError;
    
    // Fetch goals
    const { data: goalsData, error: goalsError } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId);
    
    if (goalsError) throw goalsError;
    
    // Fetch performance graph data
    const { data: graphData, error: graphError } = await supabase
      .from('performance_graph')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });
    
    if (graphError) throw graphError;
    
    // Map the data to the required format
    const formattedData: UserProgress = {
      userId: progressData.user_id,
      totalProgressPercent: ((progressData.correct_count + progressData.incorrect_count) / progressData.total_questions) * 100,
      correctAnswers: progressData.correct_count,
      incorrectAnswers: progressData.incorrect_count,
      unattemptedQuestions: progressData.unattempted_count,
      questionsAnsweredToday: graphData.length > 0 ? graphData[graphData.length - 1].attempted : 0,
      streak: progressData.streak_days,
      averageScore: progressData.avg_score,
      rank: progressData.rank,
      projectedScore: progressData.projected_score,
      speed: progressData.speed,
      easyAccuracy: progressData.easy_accuracy,
      easyAvgTime: progressData.easy_avg_time_min,
      easyCompleted: progressData.easy_completed,
      easyTotal: progressData.easy_total,
      mediumAccuracy: progressData.medium_accuracy,
      mediumAvgTime: progressData.medium_avg_time_min,
      mediumCompleted: progressData.medium_completed,
      mediumTotal: progressData.medium_total,
      hardAccuracy: progressData.hard_accuracy,
      hardAvgTime: progressData.hard_avg_time_min,
      hardCompleted: progressData.hard_completed,
      hardTotal: progressData.hard_total,
      goalAchievementPercent: goalsData.length > 0 ? 
        goalsData.reduce((acc, goal) => acc + (goal.current_value / goal.target_value), 0) / goalsData.length * 100 : 0,
      averageTime: progressData.avg_time_per_question,
      correctAnswerAvgTime: progressData.avg_time_correct,
      incorrectAnswerAvgTime: progressData.avg_time_incorrect,
      longestQuestionTime: progressData.longest_time,
      performanceGraph: graphData.map(item => ({
        date: item.date,
        attempted: item.attempted
      })),
      chapterPerformance: chapterData.map(chapter => ({
        chapterId: chapter.chapter_id,
        chapterName: chapter.chapter_name,
        correct: chapter.correct,
        incorrect: chapter.incorrect,
        unattempted: chapter.unattempted
      })),
      goals: goalsData.map(goal => ({
        id: goal.id,
        title: goal.title,
        targetValue: goal.target_value,
        currentValue: goal.current_value,
        dueDate: goal.due_date
      }))
    };
    
    return formattedData;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
}

export async function getLeaderboard(limit: number = 10) {
  try {
    // Check if tables exist, and create them if they don't
    await createTables();
    
    // Fetch leaderboard data
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .select(`
        id,
        user_id,
        problems_solved,
        accuracy,
        projected_score,
        trend_percent_change
      `)
      .order('projected_score', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      // Insert dummy leaderboard data if none exists
      const dummyEntries = [
        { user_id: '1', problems_solved: 456, accuracy: 94, projected_score: 98, trend_percent_change: 3, duration: 'weekly' },
        { user_id: '2', problems_solved: 421, accuracy: 92, projected_score: 96, trend_percent_change: 0, duration: 'weekly' },
        { user_id: '3', problems_solved: 398, accuracy: 91, projected_score: 95, trend_percent_change: 1, duration: 'weekly' },
        { user_id: '4', problems_solved: 387, accuracy: 89, projected_score: 93, trend_percent_change: -2, duration: 'weekly' },
        { user_id: '5', problems_solved: 365, accuracy: 88, projected_score: 91, trend_percent_change: 5, duration: 'weekly' },
        { user_id: '6', problems_solved: 342, accuracy: 87, projected_score: 90, trend_percent_change: -1, duration: 'weekly' },
        { user_id: '7', problems_solved: 321, accuracy: 85, projected_score: 89, trend_percent_change: 0, duration: 'weekly' },
        { user_id: '8', problems_solved: 310, accuracy: 84, projected_score: 88, trend_percent_change: 2, duration: 'weekly' },
        { user_id: '9', problems_solved: 298, accuracy: 82, projected_score: 86, trend_percent_change: -3, duration: 'weekly' },
        { user_id: '55fb126c-109d-4c10-96af-18edc09a81c7', problems_solved: 248, accuracy: 84, projected_score: 92, trend_percent_change: 4, duration: 'weekly' }
      ];
      
      for (const entry of dummyEntries) {
        await supabase
          .from('leaderboard_entries')
          .insert([entry]);
      }
      
      // Fetch the inserted data
      const { data: newData, error: newError } = await supabase
        .from('leaderboard_entries')
        .select('*')
        .order('projected_score', { ascending: false })
        .limit(limit);
        
      if (newError) throw newError;
      
      return newData.map((entry, index) => ({
        rank: index + 1,
        name: entry.user_id === '55fb126c-109d-4c10-96af-18edc09a81c7' ? 'Current User' : `User ${entry.user_id}`,
        problems: entry.problems_solved,
        accuracy: `${entry.accuracy}%`,
        score: entry.projected_score,
        trend: entry.trend_percent_change,
        isCurrentUser: entry.user_id === '55fb126c-109d-4c10-96af-18edc09a81c7'
      }));
    }
    
    return data.map((entry, index) => ({
      rank: index + 1,
      name: entry.user_id === '55fb126c-109d-4c10-96af-18edc09a81c7' ? 'Current User' : `User ${entry.user_id}`,
      problems: entry.problems_solved,
      accuracy: `${entry.accuracy}%`,
      score: entry.projected_score,
      trend: entry.trend_percent_change,
      isCurrentUser: entry.user_id === '55fb126c-109d-4c10-96af-18edc09a81c7'
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}
