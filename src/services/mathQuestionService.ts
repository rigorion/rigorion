
import { supabase } from '@/lib/supabase';
import { Question } from '@/types/QuestionInterface';

// Constants for Supabase storage
const STORAGE_BUCKET = 'sat'; // Your Supabase bucket name
const QUESTIONS_FILE = 'satMath.json'; // Your unencrypted JSON file

/**
 * Fetch unencrypted math questions directly from Supabase storage
 */
export async function fetchMathQuestions(): Promise<Question[]> {
  try {
    // Download the file from Supabase storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(QUESTIONS_FILE);
      
    if (error) {
      console.error('Error downloading math questions:', error);
      throw error;
    }
    
    if (!data) {
      console.error('No data received from storage');
      throw new Error('No data received');
    }
    
    // Parse the JSON content
    const jsonText = await data.text();
    const questions = JSON.parse(jsonText) as Question[];
    
    console.log(`Successfully loaded ${questions.length} math questions`);
    return questions;
  } catch (error) {
    console.error('Error fetching math questions:', error);
    throw error;
  }
}
