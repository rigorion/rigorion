import { supabase } from '@/lib/supabase';
import { Question } from '@/types/QuestionInterface';
import { toast } from "@/hooks/use-toast";

// Constants for Supabase storage
const STORAGE_BUCKET = 'questions'; // Updated bucket name
const QUESTIONS_FILE = 'satMath.json'; // File name in the bucket

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
      toast({
        title: "Error loading questions",
        description: `Storage error: ${error.message}`,
        variant: "destructive",
      });
      
      // Return sample questions as fallback
      return getSampleQuestions();
    }
    
    if (!data) {
      console.error('No data received from storage');
      toast({
        title: "No data received",
        description: "Could not retrieve questions from storage",
        variant: "destructive",
      });
      
      // Return sample questions as fallback
      return getSampleQuestions();
    }
    
    // Parse the JSON content
    const jsonText = await data.text();
    const questions = JSON.parse(jsonText) as Question[];
    
    console.log(`Successfully loaded ${questions.length} math questions`);
    return questions;
  } catch (error) {
    console.error('Error fetching math questions:', error);
    toast({
      title: "Error loading questions",
      description: "Using sample questions instead",
      variant: "destructive",
    });
    
    // Return sample questions as fallback
    return getSampleQuestions();
  }
}

/**
 * Get sample questions as a fallback if Supabase storage fails
 */
function getSampleQuestions(): Question[] {
  // Sample questions to use as fallback
  return [
    {
      id: "1",
      content: "What is the probability of rolling a prime number on a fair 20-sided die?",
      solution: "Prime numbers between 1-20: 2, 3, 5, 7, 11, 13, 17, 19 (8 primes)\n\nProbability = 8/20 = 2/5 = 40%",
      difficulty: "medium",
      chapter: "Chapter 1",
      bookmarked: false,
      examNumber: 1,
      choices: ["1/20", "2/5", "3/10", "1/4"],
      correctAnswer: "2/5",
      solutionSteps: [
        "Identify prime numbers from 1-20: 2, 3, 5, 7, 11, 13, 17, 19",
        "Count the number of prime numbers: 8",
        "Calculate probability: 8/20 = 2/5 = 40%"
      ],
      quote: {
        text: "Mathematics is the music of reason.",
        source: "James Joseph Sylvester"
      }
    },
    {
      id: "2",
      content: "What's the area of a circle with radius 5 cm?",
      solution: "Using formula A = πr²\nA = π × 5² = 25π ≈ 78.54 cm²",
      difficulty: "easy",
      chapter: "Chapter 1",
      bookmarked: false,
      examNumber: 1,
      choices: ["25π cm²", "10π cm²", "5π cm²", "100π cm²"],
      correctAnswer: "25π cm²",
      solutionSteps: [
        "Recall the formula for the area of a circle: A = πr²",
        "Substitute r = 5: A = π × 5²",
        "Calculate: A = 25π ≈ 78.54 cm²"
      ],
      quote: {
        text: "Geometry is the archetype of the beauty of the world.",
        source: "Johannes Kepler"
      }
    },
    {
      id: "3",
      content: "Solve for x: 3(x + 5) = 2x + 20",
      solution: "3x + 15 = 2x + 20\n3x - 2x = 20 - 15\nx = 5",
      difficulty: "medium",
      chapter: "Chapter 2",
      bookmarked: false,
      examNumber: 1,
      choices: ["x = 3", "x = 5", "x = 7", "x = 15"],
      correctAnswer: "x = 5",
      solutionSteps: [
        "Distribute: 3(x + 5) = 3x + 15",
        "Set equal to the right side: 3x + 15 = 2x + 20",
        "Subtract 2x from both sides: 3x - 2x + 15 = 20",
        "Simplify: x + 15 = 20",
        "Subtract 15 from both sides: x = 5"
      ],
      quote: {
        text: "Algebra is the intellectual instrument which has been created for rendering clear the quantitative aspects of the world.",
        source: "Alfred North Whitehead"
      }
    }
  ];
}
