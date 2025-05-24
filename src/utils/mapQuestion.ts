
import { Question } from '@/types/QuestionInterface';

/**
 * Maps a raw question from the API/DB to the shape your UI expects.
 * This ensures your UI always gets consistent data regardless of backend changes.
 */
export function mapQuestion(raw: any, index?: number): Question {
  console.log('[MAPPER] Raw question data:', raw);
  
  // Handle different possible data structures
  const questionData = raw.question || raw;
  
  // Map content field from various possible names
  const content = questionData.content || 
                 questionData.text || 
                 questionData.question_content?.text || 
                 questionData.questionText ||
                 questionData.prompt ||
                 "";

  // Map choices from various possible structures
  let choices: string[] = [];
  if (questionData.choices && Array.isArray(questionData.choices)) {
    choices = questionData.choices.map((choice: any) => 
      typeof choice === "string" ? choice : (choice.text || choice.value || String(choice))
    );
  } else if (questionData.answer_choices && Array.isArray(questionData.answer_choices)) {
    choices = questionData.answer_choices.map((choice: any) => 
      typeof choice === "string" ? choice : (choice.text || choice.value || String(choice))
    );
  } else if (questionData.options && Array.isArray(questionData.options)) {
    choices = questionData.options.map((option: any) => 
      typeof option === "string" ? option : (option.text || option.value || String(option))
    );
  } else {
    // Fallback choices
    choices = ["Option A", "Option B", "Option C", "Option D"];
  }

  // Map correct answer
  const correctAnswer = questionData.correctAnswer || 
                       questionData.correct_answer || 
                       questionData.answer || 
                       choices[0] || 
                       "";

  // Map solution/explanation
  const solution = questionData.solution || 
                  questionData.explanation || 
                  questionData.answer_explanation ||
                  questionData.rationale ||
                  "Solution not available";

  // Map difficulty
  const difficulty = questionData.difficulty === "easy" || questionData.difficulty === "hard" 
    ? questionData.difficulty 
    : "medium";

  // Map other fields
  const hint = questionData.hint || 
              questionData.help_text || 
              "Think about the problem carefully";

  const solutionSteps = Array.isArray(questionData.solutionSteps) 
    ? questionData.solutionSteps 
    : Array.isArray(questionData.solution_steps)
    ? questionData.solution_steps
    : Array.isArray(questionData.steps)
    ? questionData.steps
    : [solution];

  // Create the normalized question object
  const mappedQuestion: Question = {
    id: questionData.id?.toString() || `mapped-${index || Date.now()}`,
    content: content,
    solution: solution,
    difficulty: difficulty,
    chapter: questionData.chapter || "Secure Chapter",
    bookmarked: questionData.bookmarked || false,
    examNumber: questionData.examNumber || 1,
    choices: choices,
    correctAnswer: correctAnswer,
    explanation: questionData.explanation || solution,
    solutionSteps: solutionSteps,
    hint: hint,
    quote: questionData.quote ? {
      text: questionData.quote.text || questionData.quote,
      source: questionData.quote.source || "Unknown"
    } : {
      text: "Practice makes perfect",
      source: "Common saying"
    }
  };

  console.log('[MAPPER] Mapped question:', mappedQuestion);
  return mappedQuestion;
}

/**
 * Maps an array of raw questions to normalized Question objects
 */
export function mapQuestions(rawQuestions: any[]): Question[] {
  if (!Array.isArray(rawQuestions)) {
    console.warn('[MAPPER] Expected array of questions, got:', typeof rawQuestions);
    return [];
  }

  return rawQuestions.map((raw, index) => mapQuestion(raw, index));
}

/**
 * Validates that a question has the required fields for the UI
 */
export function validateQuestion(question: Question): boolean {
  const hasContent = typeof question.content === 'string' && question.content.length > 0;
  const hasChoices = Array.isArray(question.choices) && question.choices.length > 0;
  const hasCorrectAnswer = typeof question.correctAnswer === 'string' && question.correctAnswer.length > 0;
  
  if (!hasContent) {
    console.error('[MAPPER] Question missing content:', question);
  }
  if (!hasChoices) {
    console.error('[MAPPER] Question missing choices:', question);
  }
  if (!hasCorrectAnswer) {
    console.error('[MAPPER] Question missing correct answer:', question);
  }
  
  return hasContent && hasChoices && hasCorrectAnswer;
}
