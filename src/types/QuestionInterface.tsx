

// types/QuestionInterface.ts
export interface Question {
    id: string;
    content: string;
    solution: string;
    difficulty: "easy" | "medium" | "hard";
    chapter: string;
    module?: string;
    bookmarked: boolean;
    examNumber: number;
    choices: string[];
    correctAnswer: string;
    explanation?: string;
    graph?: {
        url: string;
        alt?: string;
        caption?: string;
    } | string;
    solutionSteps: string[];
    quote?: {
        text: string;
        source?: string;
    };
    hint?: string;
}

export default interface QuestionInterface {} // Or remove if unnecessary

