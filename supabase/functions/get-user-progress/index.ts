
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders, status: 200 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }

  try {
    // Create admin client to access data
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Generate complete progress data (this is dummy data for now - replace with actual DB queries)
    const progressData = {
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
      performance_graph: Array.from({ length: 10 }, (_, i) => ({
        date: new Date(Date.now() - (9 - i) * 24 * 3600 * 1000).toISOString().split('T')[0],
        attempted: Math.floor(Math.random() * 30) + 10,
      })),
      chapter_performance: [
        { chapterId: '1', chapterName: 'Chapter 1', correct: 12, incorrect: 3, unattempted: 5 },
        { chapterId: '2', chapterName: 'Chapter 2', correct: 8, incorrect: 2, unattempted: 5 },
        { chapterId: '3', chapterName: 'Chapter 3', correct: 10, incorrect: 5, unattempted: 10 },
        { chapterId: '4', chapterName: 'Chapter 4', correct: 20, incorrect: 4, unattempted: 6 },
        { chapterId: '5', chapterName: 'Chapter 5', correct: 5, incorrect: 3, unattempted: 10 }
      ],
      goals: [
        { id: '1', title: 'Complete 100 Questions', targetValue: 100, currentValue: 75, dueDate: '2024-05-01' },
        { id: '2', title: 'Achieve 90% in Hard Questions', targetValue: 90, currentValue: 83, dueDate: '2024-05-15' }
      ]
    };

    return new Response(
      JSON.stringify(progressData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
