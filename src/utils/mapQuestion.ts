
import { Question } from "@/types/QuestionInterface";

/**
 * Maps raw question data from various sources to standardized Question format
 */
export const mapQuestions = (rawQuestions: any[]): Question[] => {
  if (!Array.isArray(rawQuestions)) {
    console.warn('mapQuestions: Input is not an array', rawQuestions);
    return [];
  }

  return rawQuestions.map((item, index) => {
    try {
      // Handle different possible data structures
      const question = mapSingleQuestion(item, index);
      return question;
    } catch (error) {
      console.warn(`Error mapping question at index ${index}:`, error, item);
      return null;
    }
  }).filter((q): q is Question => q !== null);
};

/**
 * Maps a single raw question object to Question format
 */
export const mapSingleQuestion = (rawQuestion: any, fallbackIndex: number = 0): Question => {
  // Ensure we have some data to work with
  if (!rawQuestion || typeof rawQuestion !== 'object') {
    throw new Error('Invalid question data');
  }

  // Extract ID - try multiple possible field names
  const id = rawQuestion.id || 
             rawQuestion.question_id || 
             rawQuestion.questionId || 
             rawQuestion.number ||
             `MAPPED-${fallbackIndex + 1}`;

  // Extract content - try multiple possible field names
  const content = rawQuestion.content || 
                  rawQuestion.question || 
                  rawQuestion.text || 
                  rawQuestion.problem || 
                  rawQuestion.prompt ||
                  'Question content not available';

  // Extract choices - handle different formats
  let choices: string[] = [];
  if (rawQuestion.choices && Array.isArray(rawQuestion.choices)) {
    choices = rawQuestion.choices.map(choice => String(choice));
  } else if (rawQuestion.options && Array.isArray(rawQuestion.options)) {
    choices = rawQuestion.options.map(option => String(option));
  } else if (rawQuestion.answers && Array.isArray(rawQuestion.answers)) {
    choices = rawQuestion.answers.map(answer => String(answer));
  } else {
    // Create default choices if none provided
    choices = ['Option A', 'Option B', 'Option C', 'Option D'];
  }

  // Extract correct answer
  const correctAnswer = rawQuestion.correctAnswer || 
                       rawQuestion.correct_answer || 
                       rawQuestion.answer || 
                       rawQuestion.solution ||
                       (choices.length > 0 ? choices[0] : 'A');

  // Extract solution/explanation
  const solution = rawQuestion.solution || 
                  rawQuestion.explanation || 
                  rawQuestion.rationale || 
                  rawQuestion.workings ||
                  'Solution not available';

  // Extract difficulty
  const difficulty = rawQuestion.difficulty || 
                    rawQuestion.level || 
                    rawQuestion.complexity ||
                    'medium';

  // Normalize difficulty to expected values
  const normalizedDifficulty = normalizeDifficulty(difficulty);

  // Extract chapter
  const chapter = rawQuestion.chapter || 
                 rawQuestion.topic || 
                 rawQuestion.subject || 
                 rawQuestion.module ||
                 'Chapter 1: General';

  // Extract module
  const module = rawQuestion.module || 
                rawQuestion.subject || 
                rawQuestion.category ||
                'SAT Math';

  // Extract additional fields
  const explanation = rawQuestion.explanation || 
                     rawQuestion.hint || 
                     rawQuestion.notes ||
                     '';

  const hint = rawQuestion.hint || 
              rawQuestion.tip || 
              rawQuestion.clue ||
              'Take your time and read the question carefully.';

  // Handle graph data
  let graph: Question['graph'] = undefined;
  if (rawQuestion.graph) {
    if (typeof rawQuestion.graph === 'string') {
      graph = { url: rawQuestion.graph };
    } else if (typeof rawQuestion.graph === 'object') {
      graph = rawQuestion.graph;
    }
  } else if (rawQuestion.image || rawQuestion.diagram) {
    const imageUrl = rawQuestion.image || rawQuestion.diagram;
    if (typeof imageUrl === 'string') {
      graph = { url: imageUrl };
    }
  }

  // Handle solution steps
  let solutionSteps: string[] = [];
  if (rawQuestion.solutionSteps && Array.isArray(rawQuestion.solutionSteps)) {
    solutionSteps = rawQuestion.solutionSteps.map(step => String(step));
  } else if (rawQuestion.steps && Array.isArray(rawQuestion.steps)) {
    solutionSteps = rawQuestion.steps.map(step => String(step));
  } else if (rawQuestion.workings && Array.isArray(rawQuestion.workings)) {
    solutionSteps = rawQuestion.workings.map(step => String(step));
  }

  // Handle quote
  let quote: Question['quote'] = undefined;
  if (rawQuestion.quote) {
    if (typeof rawQuestion.quote === 'string') {
      quote = { text: rawQuestion.quote };
    } else if (typeof rawQuestion.quote === 'object') {
      quote = {
        text: rawQuestion.quote.text || rawQuestion.quote.content || '',
        source: rawQuestion.quote.source || rawQuestion.quote.author
      };
    }
  }

  // Build the mapped question
  const mappedQuestion: Question = {
    id: String(id),
    content: String(content),
    choices,
    correctAnswer: String(correctAnswer),
    solution: String(solution),
    difficulty: normalizedDifficulty,
    chapter: String(chapter),
    module: String(module),
    explanation: String(explanation),
    hint: String(hint),
    bookmarked: Boolean(rawQuestion.bookmarked || false),
    examNumber: Number(rawQuestion.examNumber || rawQuestion.exam_number || new Date().getFullYear()),
  };

  // Add optional fields if they exist
  if (graph) {
    mappedQuestion.graph = graph;
  }

  if (solutionSteps.length > 0) {
    mappedQuestion.solutionSteps = solutionSteps;
  }

  if (quote) {
    mappedQuestion.quote = quote;
  }

  return mappedQuestion;
};

/**
 * Normalizes difficulty strings to expected values
 */
const normalizeDifficulty = (difficulty: any): 'easy' | 'medium' | 'hard' => {
  if (typeof difficulty !== 'string') {
    return 'medium';
  }

  const normalized = difficulty.toLowerCase().trim();
  
  if (normalized.includes('easy') || normalized.includes('beginner') || normalized.includes('basic')) {
    return 'easy';
  }
  
  if (normalized.includes('hard') || normalized.includes('difficult') || normalized.includes('advanced') || normalized.includes('challenging')) {
    return 'hard';
  }
  
  return 'medium';
};

/**
 * Validates that a question has all required fields
 */
export const validateQuestion = (question: Question): boolean => {
  try {
    // Check required fields
    if (!question || typeof question !== 'object') {
      console.warn('validateQuestion: Question is not an object', question);
      return false;
    }

    if (!question.id || typeof question.id !== 'string') {
      console.warn('validateQuestion: Missing or invalid id', question.id);
      return false;
    }

    if (!question.content || typeof question.content !== 'string') {
      console.warn('validateQuestion: Missing or invalid content', question.content);
      return false;
    }

    if (!Array.isArray(question.choices) || question.choices.length === 0) {
      console.warn('validateQuestion: Missing or invalid choices', question.choices);
      return false;
    }

    if (!question.correctAnswer || typeof question.correctAnswer !== 'string') {
      console.warn('validateQuestion: Missing or invalid correctAnswer', question.correctAnswer);
      return false;
    }

    if (!question.solution || typeof question.solution !== 'string') {
      console.warn('validateQuestion: Missing or invalid solution', question.solution);
      return false;
    }

    // Check that correctAnswer exists in choices (flexible matching)
    const answerExists = question.choices.some(choice => 
      choice === question.correctAnswer || 
      choice.toLowerCase() === question.correctAnswer.toLowerCase() ||
      choice.trim() === question.correctAnswer.trim()
    );

    if (!answerExists) {
      console.warn('validateQuestion: correctAnswer not found in choices', {
        correctAnswer: question.correctAnswer,
        choices: question.choices
      });
      // Don't fail validation for this - just log the warning
    }

    return true;
  } catch (error) {
    console.warn('validateQuestion: Error during validation', error, question);
    return false;
  }
};

/**
 * Filter questions by chapter number
 */
export const filterQuestionsByChapter = (questions: Question[], chapterNumber: string): Question[] => {
  if (!chapterNumber || chapterNumber === 'all') {
    return questions;
  }

  return questions.filter(question => {
    const chapterMatch = question.chapter.match(/Chapter (\d+)/i);
    return chapterMatch && chapterMatch[1] === chapterNumber;
  });
};

/**
 * Get unique chapters from questions array
 */
export const getUniqueChapters = (questions: Question[]): string[] => {
  const chapters = new Set<string>();
  
  questions.forEach(question => {
    if (question.chapter) {
      chapters.add(question.chapter);
    }
  });

  return Array.from(chapters).sort();
};

/**
 * Filter questions by module
 */
export const filterQuestionsByModule = (questions: Question[], module: string): Question[] => {
  if (!module || module === 'all') {
    return questions;
  }

  return questions.filter(question => 
    question.module && question.module.toLowerCase() === module.toLowerCase()
  );
};

/**
 * Get unique modules from questions array
 */
export const getUniqueModules = (questions: Question[]): string[] => {
  const modules = new Set<string>();
  
  questions.forEach(question => {
    if (question.module) {
      modules.add(question.module);
    }
  });

  return Array.from(modules).sort();
};

/**
 * Debug function to log question mapping issues
 */
export const debugQuestionMapping = (rawQuestions: any[], mappedQuestions: Question[]): void => {
  console.group('Question Mapping Debug');
  console.log(`Raw questions count: ${rawQuestions.length}`);
  console.log(`Mapped questions count: ${mappedQuestions.length}`);
  console.log(`Success rate: ${((mappedQuestions.length / rawQuestions.length) * 100).toFixed(1)}%`);
  
  if (rawQuestions.length > 0) {
    console.log('Sample raw question:', rawQuestions[0]);
  }
  
  if (mappedQuestions.length > 0) {
    console.log('Sample mapped question:', mappedQuestions[0]);
  }
  
  console.groupEnd();
};
