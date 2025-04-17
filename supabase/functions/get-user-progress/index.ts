
import { serve } from 'https://deno.fresh.dev/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId } = await req.json()
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Get main user progress
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (progressError) throw progressError

    // Get performance graph data
    const { data: graphData, error: graphError } = await supabase
      .from('performance_graph')
      .select('date, attempted')
      .eq('user_id', userId)
      .order('date', { ascending: true })
      .limit(10)

    if (graphError) throw graphError

    // Get chapter performance
    const { data: chapterData, error: chapterError } = await supabase
      .from('chapter_performance')
      .select('*')
      .eq('user_id', userId)

    if (chapterError) throw chapterError

    // Get user goals
    const { data: goalsData, error: goalsError } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)

    if (goalsError) throw goalsError

    // Combine all data
    const userProgressData = {
      ...progressData,
      performance_graph: graphData,
      chapter_performance: chapterData,
      goals: goalsData
    }

    return new Response(
      JSON.stringify(userProgressData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
