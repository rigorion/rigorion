
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Set up CORS headers to allow all origins
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
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), { 
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } }
      }
    );

    // Get the current user from the JWT token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error("Error getting user from token:", userError);
      return new Response(
        JSON.stringify({ error: "Invalid authorization token" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401
        }
      );
    }

    // Get parameters from request
    let limit = 10;
    let userId = user.id;

    if (req.method === "POST") {
      try {
        const body = await req.json();
        limit = body.limit || 10;
      } catch (e) {
        console.log("Could not parse JSON body");
      }
    }

    // For this demo, we'll generate static leaderboard data
    // In a real app, you would query your database
    const leaderboardData = generateLeaderboardData(userId, limit);

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

function generateLeaderboardData(currentUserId: string, limit = 10) {
  // Create an array of random users
  const leaderboard = [];
  
  // Randomly insert the current user between ranks 1-10
  const currentUserRank = Math.floor(Math.random() * 10) + 1;
  
  for (let i = 1; i <= limit; i++) {
    const isCurrentUser = i === currentUserRank;
    
    leaderboard.push({
      user_id: isCurrentUser ? currentUserId : `user-${i}`,
      name: isCurrentUser ? 'You' : `User ${i}`,
      problems_solved: Math.floor(150 - (i * (150 / limit))),
      accuracy: Math.floor(98 - (i * 2)),
      score: Math.floor(1000 - (i * (1000 / limit))),
      trend_percent_change: Math.floor(Math.random() * 20) - 10,
      is_current_user: isCurrentUser
    });
  }
  
  // Sort by score
  return leaderboard.sort((a, b) => b.score - a.score);
}
