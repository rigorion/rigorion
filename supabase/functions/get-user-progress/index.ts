import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Set up CORS headers to allow all origins
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Get the authorization header
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    throw new Error("No authorization header");
  }

  // Create Supabase client
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: { headers: { Authorization: authHeader } }
    }
  );

  // Parse request body if it exists
  let userId;
  let period = "weekly";
  
  try {
    const body = await req.json();
    userId = body.userId;
    period = body.period || "weekly";
  } catch (e) {
    // If request body parsing fails, get from the URL params
    const url = new URL(req.url);
    userId = url.searchParams.get("userId");
    period = url.searchParams.get("period") || "weekly";
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  // Generate fallback data for this demo
  // In a real implementation, you would query the database for actual user data
  const totalQuestions = 130;
  const correctCount = 53;
  const incorrectCount = 21;
  const unattemptedCount = 56;
  
  const responseData = {
    user_id: userId,
    total_questions: totalQuestions,
    correct_count: correctCount,
    incorrect_count: incorrectCount,
    unattempted_count: unattemptedCount,
    total_progress_percent: Math.round((correctCount + incorrectCount) / totalQuestions * 100)
  };

  try {
    return new Response(
      JSON.stringify(responseData), 
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      }
    );
  }
});
