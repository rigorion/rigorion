
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });
  }

  const mockTests = [
    { id: '1', name: 'Mock Test 1', status: 'completed', score: 85 },
    { id: '2', name: 'Mock Test 2', status: 'in-progress' },
    { id: '3', name: 'Mock Test 3', status: 'unattempted' },
    { id: '4', name: 'Mock Test 4', status: 'completed', score: 92 },
    { id: '5', name: 'Mock Test 5', status: 'in-progress' },
    { id: '6', name: 'Mock Test 6', status: 'completed', score: 78 },
    { id: '7', name: 'Mock Test 7', status: 'unattempted' },
    { id: '8', name: 'Mock Test 8', status: 'incomplete' },
    { id: '9', name: 'Mock Test 9', status: 'completed', score: 89 },
    { id: '10', name: 'Mock Test 10', status: 'in-progress' },
    { id: '11', name: 'Mock Test 11', status: 'completed', score: 95 },
    { id: '12', name: 'Mock Test 12', status: 'unattempted' },
    { id: '13', name: 'Mock Test 13', status: 'completed', score: 81 },
    { id: '14', name: 'Mock Test 14', status: 'in-progress' },
    { id: '15', name: 'Mock Test 15', status: 'completed', score: 87 },
  ];

  return new Response(
    JSON.stringify(mockTests),
    { 
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      } 
    }
  );
});
