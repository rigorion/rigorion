import { supabase } from '@/lib/supabase';
import { Question } from '@/types/QuestionInterface';
import { toast } from "@/hooks/use-toast";
import type { UserProgressData } from '@/types/progress';

// Your actual deployed Supabase Edge Function URL
const EDGE_FUNCTION_URL = 'https://eantvimmgdmxzwr.supabase.co/functions/v1/my-function';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://eantvimmgdmxzwr.supabase.co/functions/v1/my-function',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhbnR2aW1tZ2RteHp3cmp3cm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MTA5MjQsImV4cCI6MjA2MTE4NjkyNH0.ba6UMchrXuMqmkWXzoC2Dd91y-HJm_cB1NMmwNRly-k'
);

// Define all endpoints
const endpoints = [
  { name: 'get-progress' },
  { name: 'log-interaction', method: 'POST', body: { type: 'viewed', questionId: 101 } },
  { name: 'get-sat-math-questions' },
  { name: 'get-user-progress', body: { period: 'weekly' } },
  { name: 'get-apijson' },
  { name: 'my-function', body: { name: 'Functions' } },
];

// Invoke all endpoints and collect responses
async function fetchAllResponses() {
  const results = await Promise.all(
    endpoints.map(async ({ name, method = 'GET', body }) => {
      const { data, error } = await supabase.functions.invoke(name, {
        method,
        ...(body ? { body } : {}),
      });

      return {
        name,
        data,
        error,
      };
    })
  );

  return results;
}

// Example usage
fetchAllResponses().then((responses) => {
  responses.forEach(({ name, data, error }) => {
    if (error) {
      console.error(`❌ Error from ${name}:`, error);
    } else {
      console.log(`✅ Response from ${name}:`, data);
    }
  });
});


