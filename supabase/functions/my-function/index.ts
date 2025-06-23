
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

  // Sample data to return - formatted for the mapper
  const data = {
    id: "func-1",
    name: "My Function Data",
    timestamp: new Date().toISOString(),
    questions: [
      {
        id: "edge-1",
        number: 1,
        content: "If 3x + 7 = 22, what is the value of x?",
        choices: ["x = 4", "x = 5", "x = 6", "x = 7"],
        correctAnswer: "B",
        solution: "To solve 3x + 7 = 22, subtract 7 from both sides: 3x = 15, then divide by 3: x = 5",
        solutionSteps: [
          "Start with the equation: 3x + 7 = 22",
          "Subtract 7 from both sides: 3x = 15", 
          "Divide both sides by 3: x = 5"
        ],
        difficulty: "medium",
        chapter: "Algebra",
        module: "SAT Math",
        examNumber: 1,
        hint: "Use inverse operations to isolate the variable"
      },
      {
        id: "edge-2",
        number: 2,
        content: "What is the area of a rectangle with length 8 and width 5?",
        choices: ["30", "35", "40", "45"],
        correctAnswer: "C",
        solution: "Area of rectangle = length × width = 8 × 5 = 40",
        solutionSteps: [
          "Use the formula: Area = length × width",
          "Substitute values: Area = 8 × 5",
          "Calculate: Area = 40"
        ],
        difficulty: "easy",
        chapter: "Geometry",
        module: "SAT Math",
        examNumber: 1,
        hint: "Remember the formula for area of a rectangle"
      },
      {
        id: "edge-3",
        number: 3,
        content: "If f(x) = 2x² - 4x + 1, what is f(2)?",
        choices: ["-3", "-1", "1", "3"],
        correctAnswer: "B",
        solution: "Substitute x = 2: f(2) = 2(2)² - 4(2) + 1 = 2(4) - 8 + 1 = 8 - 8 + 1 = 1",
        solutionSteps: [
          "Substitute x = 2 into the function",
          "Calculate: f(2) = 2(2)² - 4(2) + 1",
          "Simplify: f(2) = 2(4) - 8 + 1 = 8 - 8 + 1 = 1"
        ],
        difficulty: "medium",
        chapter: "Functions",
        module: "SAT Math", 
        examNumber: 2,
        hint: "Substitute the given value and follow order of operations",
        graph: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop"
      },
      {
        id: "edge-4",
        number: 4,
        content: "A line passes through points (1, 3) and (5, 11). What is the slope?",
        choices: ["1", "2", "3", "4"],
        correctAnswer: "B", 
        solution: "Use slope formula: m = (y₂ - y₁)/(x₂ - x₁) = (11 - 3)/(5 - 1) = 8/4 = 2",
        solutionSteps: [
          "Identify points: (1, 3) and (5, 11)",
          "Apply slope formula: m = (y₂ - y₁)/(x₂ - x₁)",
          "Calculate: m = (11 - 3)/(5 - 1) = 8/4 = 2"
        ],
        difficulty: "medium",
        chapter: "Linear Functions",
        module: "SAT Math",
        examNumber: 1,
        hint: "Use the slope formula with the two given points",
        graph: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop"
      }
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
