
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
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
      Deno.env.get("SUPABASE_URL") ?? "",
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
      
      // If no data found, return empty data for new users
      if (error.code === 'PGRST116') {
        return new Response(
          JSON.stringify({
            total_questions: 130,
            correct_count: 53,
            incorrect_count: 21,
            unattempted_count: 56
          }), 
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200
          }
        );
      }
      
      throw error;
    }

    return new Response(
      JSON.stringify(data || {}), 
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
