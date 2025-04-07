import { Question } from "@/types/QuestionInterface";

export const sampleQuestions: Question[] = [
  {
    id: "MATH-001",
    content: "What's the area of a circle with radius 5 cm?",
    solution: "Using the formula A = πr², the area is calculated as 25π cm²",
    difficulty: "medium",
    chapter: "Chapter 1: Introduction to Mathematics",
    bookmarked: false,
    examNumber: 2024,
    choices: ["25π cm²", "10π cm²", "5π cm²", "100π cm²"],
    correctAnswer: "25π cm²",
    explanation: "Remember to square the radius before multiplying by π",
    graph: {
      url: "/graphs/circle-area.svg",
      alt: "Diagram showing circle with radius 5cm",
      caption: "Visual representation of the circle"
    },
    solutionSteps: [
      "Start with the area formula: A = πr²",
      "Substitute the radius: r = 5cm",
      "Calculate the square: 5² = 25",
      "Multiply by π: 25 × π",
      "Final result: 25π cm²",
      "Start with the area formula: A = πr²",
      "Substitute the radius: r = 5cm",
      "Calculate the square: 5² = 25",
      "Multiply by π: 25 × π",
      "Final result: 25π cm²",
      "Substitute the radius: r = 5cm",
      "Calculate the square: 5² = 25",
      "Multiply by π: 25 × π",
      "Final result: 25π cm²"

    ],
    quote: {
      text: "The discovery of π revolutionized our understanding of circular geometry",
      source: "Mathematics Historical Archives"
    }
  },
  {
    id: "LIT-002",
    content: "Who wrote 'Romeo and Juliet'?",
    solution: "William Shakespeare authored this classic tragedy",
    difficulty: "easy",
    chapter: "Chapter 3: Classic Literature",
    bookmarked: true,
    examNumber: 2023,
    choices: [
      "Charles Dickens",
      "William Shakespeare",
      "Jane Austen",
      "Mark Twain"
    ],
    correctAnswer: "William Shakespeare",
    explanation: "First performed in 1597",
    solutionSteps: [
      "Identify the work as a Renaissance-era play",
      "Recognize Shakespeare's signature tragic style",
      "Recall publication date (1597)",
      "Confirm with author's biography"
    ],
    quote: {
      text: "For never was a story of more woe than this of Juliet and her Romeo",
      source: "Romeo and Juliet, Act 5 Scene 3"
    }
  },
  {
    id: "SCI-003", 
    content: "What is the chemical symbol for gold?",
    solution: "The symbol for gold is Au from Latin 'aurum'",
    difficulty: "easy",
    chapter: "Chapter 5: Basic Chemistry",
    bookmarked: false,
    examNumber: 2024,
    choices: ["Ag", "Fe", "Au", "Cu"],
    correctAnswer: "Au",
    explanation: "Atomic number 79",
    solutionSteps: [
      "Recall periodic table elements",
      "Identify noble metals section",
      "Match atomic number 79",
      "Verify Latin origin: Aurum"
    ]
  }
];

export default sampleQuestions; 
