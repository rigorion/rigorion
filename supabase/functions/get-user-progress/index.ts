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

const { data, error } = await supabaseClient
  .from("user_progress")
  .select("total_questions, correct_count, incorrect_count, unattempted_count")
  .eq("user_id", userId)
  .single();

if (error || !data) throw new Error("User progress not found");

const responseData = {
  user_id: userId,
  ...data,
  total_progress_percent: Math.round((data.correct_count + data.incorrect_count) / data.total_questions * 100)
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
