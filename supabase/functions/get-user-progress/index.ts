
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Updated CORS headers to match what works in the response
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
  console.log("Processing request with token:", token.substring(0, 10) + "...");

  try {
    // Create Supabase client with the token
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
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

    // Verify the token first
    const { data: { user }, error: verifyError } = await supabaseAdmin.auth.getUser(token);

    if (verifyError || !user) {
      console.error("Error verifying user token:", verifyError);
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401
        }
      );
    }

    console.log("Token verified for user:", user.id);

    // Create a client with the user's token
    const supabaseClient = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { 
          headers: { Authorization: `Bearer ${token}` }
        }
      }
    );

    // Get user progress data (with RLS applied)
    const { data, error } = await supabaseClient
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Database query error:", error);
      
      // If no data found, return dummy data for new users
      if (error.code === 'PGRST116') {
        return new Response(
          JSON.stringify(generateDummyData(user.id)), 
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200
          }
        );
      }
      
      throw error;
    }

    return new Response(
      JSON.stringify(data || generateDummyData(user.id)), 
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
        status: 500
      }
    );
  }
});

// Generate complete dummy data for new users or when fetching fails
function generateDummyData(userId: string) {
  // Generate performance graph data for last 10 days
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

  // Generate chapter performance data
  const chapterPerformance = [
    { chapterId: '1', chapterName: 'Chapter 1', correct: 12, incorrect: 3, unattempted: 5 },
    { chapterId: '2', chapterName: 'Chapter 2', correct: 8, incorrect: 2, unattempted: 5 },
    { chapterId: '3', chapterName: 'Chapter 3', correct: 10, incorrect: 5, unattempted: 10 },
    { chapterId: '4', chapterName: 'Chapter 4', correct: 20, incorrect: 4, unattempted: 6 },
    { chapterId: '5', chapterName: 'Chapter 5', correct: 5, incorrect: 3, unattempted: 10 }
  ];

  // Generate goals data
  const goals = [
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
    }
  ];

  return {
    user_id: userId,
    total_progress_percent: 75,
    correct_answers: 53,
    incorrect_answers: 21,
    unattempted_questions: 56,
    questions_answered_today: 12,
    streak: 7,
    average_score: 92,
    rank: 120,
    projected_score: 92,
    speed: 85,
    easy_accuracy: 90,
    easy_avg_time: 1.5,
    easy_completed: 45,
    easy_total: 50,
    medium_accuracy: 70,
    medium_avg_time: 2.5,
    medium_completed: 35,
    medium_total: 50,
    hard_accuracy: 83,
    hard_avg_time: 4.0,
    hard_completed: 25,
    hard_total: 30,
    goal_achievement_percent: 75,
    average_time: 2.5,
    correct_answer_avg_time: 2.0,
    incorrect_answer_avg_time: 3.5,
    longest_question_time: 8.0,
    performance_graph: performanceGraph,
    chapter_performance: chapterPerformance,
    goals: goals
  };
}
