
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

  // Map correct answer - handle character fields like "A", "B", "C", "D"
  let correctAnswer = questionData.correctAnswer || 
                     questionData.correct_answer || 
                     questionData.answer || 
                     "";

  // If the correct answer is a character (A, B, C, D), map it to the actual choice text
  if (correctAnswer && correctAnswer.length === 1 && /[A-D]/i.test(correctAnswer)) {
    const answerIndex = correctAnswer.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
    if (answerIndex >= 0 && answerIndex < choices.length) {
      correctAnswer = choices[answerIndex];
    }
  }

  // Fallback to first choice if no correct answer found
  if (!correctAnswer && choices.length > 0) {
    correctAnswer = choices[0];
  }

  // Map solution/explanation with proper formatting
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
              "Think about the problem step by step";

  // Map solution steps - handle various formats
  let solutionSteps: string[] = [];
  if (Array.isArray(questionData.solutionSteps)) {
    solutionSteps = questionData.solutionSteps.map((step: any) => 
      typeof step === 'string' ? step : String(step)
    );
  } else if (Array.isArray(questionData.solution_steps)) {
    solutionSteps = questionData.solution_steps.map((step: any) => 
      typeof step === 'string' ? step : String(step)
    );
  } else if (Array.isArray(questionData.steps)) {
    solutionSteps = questionData.steps.map((step: any) => 
      typeof step === 'string' ? step : String(step)
    );
  } else if (solution && solution !== "Solution not available") {
    // Split solution into steps if no explicit steps provided
    solutionSteps = solution.split('\n').filter((step: string) => step.trim().length > 0);
  } else {
    solutionSteps = ["Follow the standard approach for this type of problem"];
  }

  // Map chapter and exam fields for filtering
  const chapter = questionData.chapter || 
                 questionData.chapter_name ||
                 questionData.unit ||
                 "General";

  const examNumber = questionData.examNumber || 
                    questionData.exam_number ||
                    questionData.exam ||
                    questionData.test_number ||
                    1;

  // Create the normalized question object
  const mappedQuestion: Question = {
    id: questionData.id?.toString() || `mapped-${index || Date.now()}`,
    content: content,
    solution: solution,
    difficulty: difficulty,
    chapter: chapter,
    bookmarked: questionData.bookmarked || false,
    examNumber: examNumber,
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
  const hasSolution = typeof question.solution === 'string' && question.solution.length > 0;
  
  if (!hasContent) {
    console.error('[MAPPER] Question missing content:', question);
  }
  if (!hasChoices) {
    console.error('[MAPPER] Question missing choices:', question);
  }
  if (!hasCorrectAnswer) {
    console.error('[MAPPER] Question missing correct answer:', question);
  }
  if (!hasSolution) {
    console.warn('[MAPPER] Question missing solution:', question);
  }
  
  return hasContent && hasChoices && hasCorrectAnswer;
}

/**
 * Filters questions by exam and chapter
 */
export function filterQuestions(
  questions: Question[], 
  examFilter?: number | "all", 
  chapterFilter?: string | "all"
): Question[] {
  return questions.filter(question => {
    const examMatch = examFilter === "all" || examFilter === undefined || question.examNumber === examFilter;
    const chapterMatch = chapterFilter === "all" || chapterFilter === undefined || question.chapter === chapterFilter;
    return examMatch && chapterMatch;
  });
}

/**
 * Get unique exams from questions array
 */
export function getUniqueExams(questions: Question[]): number[] {
  const exams = questions.map(q => q.examNumber).filter(exam => exam !== undefined);
  return [...new Set(exams)].sort((a, b) => a - b);
}

/**
 * Get unique chapters from questions array
 */
export function getUniqueChapters(questions: Question[]): string[] {
  const chapters = questions.map(q => q.chapter).filter(chapter => chapter !== undefined);
  return [...new Set(chapters)].sort();
}
