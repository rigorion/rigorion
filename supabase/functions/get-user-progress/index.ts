
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials')
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Parse request body
    const { userId, period = 'weekly' } = await req.json()

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }

    // Fetch core progress data
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (progressError) throw progressError

    // Fetch related data
    const [{ data: performance }, { data: chapters }, { data: goals }] = await Promise.all([
      supabase
        .from('performance_graph')
        .select('date, attempted')
        .eq('user_id', userId)
        .order('date', { ascending: true })
        .limit(10),
      supabase
        .from('chapter_performance')
        .select('chapter_id, chapter_name, correct, incorrect, unattempted')
        .eq('user_id', userId),
      supabase
        .from('user_goals')
        .select('id, title, target_value, current_value, due_date')
        .eq('user_id', userId)
    ])

    // Transform data to match your frontend expectations
    const responseData = {
      user_id: userId,
      total_progress_percent: Math.round((progress.correct_count + progress.incorrect_count) / progress.total_questions * 100),
      correct_answers: progress.correct_count,
      incorrect_answers: progress.incorrect_count,
      unattempted_questions: progress.unattempted_count,
      questions_answered_today: 0, // You'll need to implement daily tracking
      streak: progress.streak_days,
      average_score: progress.avg_score,
      rank: progress.rank,
      projected_score: progress.projected_score,
      speed: progress.speed,
      easy_accuracy: progress.easy.accuracy,
      easy_avg_time: progress.easy.avg_time,
      easy_completed: progress.easy.completed,
      easy_total: progress.easy.total,
      medium_accuracy: progress.medium.accuracy,
      medium_avg_time: progress.medium.avg_time,
      medium_completed: progress.medium.completed,
      medium_total: progress.medium.total,
      hard_accuracy: progress.hard.accuracy,
      hard_avg_time: progress.hard.avg_time,
      hard_completed: progress.hard.completed,
      hard_total: progress.hard.total,
      performance_graph: performance || [],
      chapter_performance: chapters || [],
      goals: goals?.map(g => ({
        ...g,
        current_value: g.current_value,
        target_value: g.target_value
      })) || []
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch progress',
      message: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
