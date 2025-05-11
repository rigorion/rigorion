
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Use environment variables from .env file
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://eantvimmgdmxzwrjwrop.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhbnR2aW1tZ2RteHp3cmp3cm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2ODkxNjksImV4cCI6MjA1ODI2NTE2OX0.AN7JVRiz4aFANJPliLpyIfWYC3JxYBeVTYkyZm1sBPo";

console.log("Initializing Supabase with URL:", SUPABASE_URL);
console.log("Using Supabase ANON KEY (first 10 chars):", SUPABASE_ANON_KEY.substring(0, 10) + "...");

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
