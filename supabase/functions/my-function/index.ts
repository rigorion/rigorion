
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Set CORS headers
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

  // Sample data to return
  const data = {
    id: "func-1",
    name: "My Function Data",
    timestamp: new Date().toISOString(),
    questions: [
      { id: 1, text: "What is 2+2?", answer: "4", difficulty: "easy" },
      { id: 2, text: "What is the square root of 16?", answer: "4", difficulty: "medium" },
      { id: 3, text: "What is the derivative of x²?", answer: "2x", difficulty: "hard" }
    ],
    stats: {
      totalQuestions: 25,
      answeredCorrect: 18,
      accuracy: 0.72,
      averageTime: 45.2
    },
    user: {
      id: "user-123",
      progress: 0.65,
      lastActive: new Date().toISOString()
    }
  };

  // Return the response with CORS headers
  return new Response(
    JSON.stringify(data),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    },
  );
});
