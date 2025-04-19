
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let limit = 10;
    try {
      const body = await req.json();
      limit = body.limit || 10;
    } catch (e) {
      // If body parsing fails, check URL params
      const url = new URL(req.url);
      const limitParam = url.searchParams.get('limit');
      if (limitParam) {
        limit = parseInt(limitParam, 10);
      }
    }

    // For this demo, we'll generate static leaderboard data
    // In a real app, you would query your database
    const leaderboardData = Array.from({ length: limit }, (_, i) => ({
      id: `user-${i+1}`,
      user_id: `user-${i+1}`,
      rank: i + 1,
      name: `User ${i + 1}`,
      score: Math.floor(1000 - (i * (1000 / limit))),
      avatar_url: null,
      questions_completed: Math.floor(150 - (i * (150 / limit))),
    }));

    return new Response(
      JSON.stringify(leaderboardData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
