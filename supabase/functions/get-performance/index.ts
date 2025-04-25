
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Set up CORS headers to match the get-user-progress function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders, status: 200 });
  }

  // Get the authorization header
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error("Invalid or missing Bearer token");
    return new Response(JSON.stringify({ error: "Invalid authorization header" }), { 
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      throw new Error("Missing required environment variables");
    }

    // First verify the token with the admin client
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    // Verify the token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

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

    console.log("Authenticated user:", user.id);

    // Generate performance data for now
    // In a real scenario, you would query your database for this data
    const performanceData = generatePerformanceData(user.id);

    return new Response(
      JSON.stringify(performanceData), 
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      }
    );
  }
});

function generatePerformanceData(userId: string) {
  const today = new Date();
  const performanceGraph = [];
  
  for (let i = 9; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0];
    
    performanceGraph.push({
      date: formattedDate,
      attempted: Math.floor(Math.random() * 30) + 10,
    });
  }

  return {
    userId,
    performance_graph: performanceGraph
  };
}
