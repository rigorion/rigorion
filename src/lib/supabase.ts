
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Use environment variables with fallbacks
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Initializing Supabase client with URL:", SUPABASE_URL);
console.log("API Key format check:", SUPABASE_ANON_KEY ? `Key length: ${SUPABASE_ANON_KEY.length}` : "Missing key");

// Validate configuration
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing Supabase configuration. Using demo project configuration.");
}

export const supabase = createClient(
  SUPABASE_URL || "https://xyzcompany.supabase.co",
  SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.Rl41HWI8A4tGS4WjOVgD6jNg42xk_XiKQbDrEcBtAhA"
);
