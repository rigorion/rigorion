
import { serve } from 'https://deno.fresh.dev/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

serve(async (req) => {
  // Handle preflight requests for CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client using environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse request body
    const { userId, period = 'weekly' } = await req.json()
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Check if the user exists
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    if (userError || !userData) {
      return new Response(
        JSON.stringify({ error: 'User not found', details: userError }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      )
    }

    // Get user progress data - for now, we'll just generate mock data
    // This would be replaced with actual database queries in production
    const mockData = {
      user_id: userId,
      total_progress_percent: 65,
      correct_answers: 78,
      incorrect_answers: 22,
      unattempted_questions: 30,
      questions_answered_today: 12,
      streak: 5,
      average_score: 88,
      rank: 134,
      projected_score: 90,
      speed: 75,
      easy_accuracy: 92,
      easy_avg_time: 2.0,
      easy_completed: 40,
      easy_total: 45,
      medium_accuracy: 75,
      medium_avg_time: 3.5,
      medium_completed: 30,
      medium_total: 45,
      hard_accuracy: 60,
      hard_avg_time: 5.0,
      hard_completed: 18,
      hard_total: 40,
      goal_achievement_percent: 68,
      average_time: 3.2,
      correct_answer_avg_time: 2.8,
      incorrect_answer_avg_time: 4.5,
      longest_question_time: 9.5,
      performance_graph: Array.from({ length: 10 }, (_, i) => ({
        date: new Date(Date.now() - (9-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        attempted: Math.floor(Math.random() * 20) + 5
      })),
      chapter_performance: [
        { chapter_id: '1', chapter_name: 'Introduction', correct: 15, incorrect: 5, unattempted: 5 },
        { chapter_id: '2', chapter_name: 'Fundamentals', correct: 12, incorrect: 3, unattempted: 10 },
        { chapter_id: '3', chapter_name: 'Advanced Topics', correct: 8, incorrect: 7, unattempted: 15 }
      ],
      goals: [
        { id: '1', title: 'Complete 100 questions', target_value: 100, current_value: 68, due_date: '2024-06-01' },
        { id: '2', title: 'Reach 90% accuracy', target_value: 90, current_value: 78, due_date: '2024-06-15' }
      ]
    };

    // Return the mock data
    return new Response(
      JSON.stringify(mockData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Edge function error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
