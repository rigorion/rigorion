// services/questionService.ts
import { supabase } from '@/lib/supabase'
import { Question } from '@/types/QuestionInterface'

import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://eantvimmgdmxzwrjwrop.supabase.co/functions/v1/my-function', eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhbnR2aW1tZ2RteHp3cmp3cm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MTA5MjQsImV4cCI6MjA2MTE4NjkyNH0.ba6UMchrXuMqmkWXzoC2Dd91y-HJm_cB1NMmwNRly-k)
const { data, error } = await supabase.functions.invoke('get-sat-model-question', {
  body: { name: 'Functions' },
})