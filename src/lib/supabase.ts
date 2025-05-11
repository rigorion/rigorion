
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Always use hardcoded values for now to ensure consistency
const SUPABASE_URL = "https://eantvimmgdmxzwrjwrop.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhbnR2aW1tZ2RteHp3cmp3cm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2ODkxNjksImV4cCI6MjA1ODI2NTE2OX0.AN7JVRiz4aFANJPliLpyIfWYC3JxYBeVTYkyZm1sBPo";

console.log("Initializing Supabase with URL:", SUPABASE_URL);
console.log("Using hardcoded Supabase ANON KEY");

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

