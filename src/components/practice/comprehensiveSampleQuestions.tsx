import { Question } from "@/types/QuestionInterface";

// Comprehensive sample questions covering all chapters, subjects, and exam numbers
export const comprehensiveSampleQuestions: Question[] = [
  // Math Questions - Chapter 1: Heart of Algebra
  {
    id: "MATH-001",
    number: 1,
    content: "If 3x + 5 = 17, what is the value of x?",
    solution: "Solving: 3x + 5 = 17, subtract 5 from both sides: 3x = 12, divide by 3: x = 4",
    difficulty: "easy",
    chapter: "Chapter 1", 
    module: "All SAT Math",
    bookmarked: false,
    examNumber: 1,
    choices: ["2", "3", "4", "5"],
    correctAnswer: "4",
    explanation: "Solve by isolating x using inverse operations",
    solutionSteps: [
      "Start with: 3x + 5 = 17",
      "Subtract 5 from both sides: 3x = 12", 
      "Divide both sides by 3: x = 4"
    ]
  },
  {
    id: "MATH-002", 
    number: 2,
    content: "What is the slope of the line passing through points (2, 3) and (6, 11)?",
    solution: "Using slope formula: m = (y₂ - y₁)/(x₂ - x₁) = (11 - 3)/(6 - 2) = 8/4 = 2",
    difficulty: "medium",
    chapter: "Chapter 1",
    module: "All SAT Math", 
    bookmarked: false,
    examNumber: 1,
    choices: ["1", "2", "3", "4"],
    correctAnswer: "2",
    explanation: "Use the slope formula with the given coordinates",
    solutionSteps: [
      "Identify points: (2, 3) and (6, 11)",
      "Apply slope formula: m = (y₂ - y₁)/(x₂ - x₁)",
      "Substitute: m = (11 - 3)/(6 - 2) = 8/4 = 2"
    ]
  },

  // Math Questions - Chapter 2: Problem Solving and Data Analysis  
  {
    id: "MATH-003",
    number: 3, 
    content: "A survey shows that 60% of 250 students prefer pizza. How many students prefer pizza?",
    solution: "60% of 250 = 0.6 × 250 = 150 students",
    difficulty: "easy",
    chapter: "Chapter 2",
    module: "All SAT Math",
    bookmarked: false,
    examNumber: 2,
    choices: ["120", "135", "150", "165"],
    correctAnswer: "150",
    explanation: "Convert percentage to decimal and multiply",
    solutionSteps: [
      "Convert 60% to decimal: 0.6",
      "Multiply by total: 0.6 × 250 = 150"
    ]
  },
  {
    id: "MATH-004",
    number: 4,
    content: "The mean of 5 numbers is 12. If four of the numbers are 8, 10, 14, and 16, what is the fifth number?",
    solution: "Mean = Sum/Count, so 12 = Sum/5, Sum = 60. Fifth number = 60 - (8+10+14+16) = 60 - 48 = 12",
    difficulty: "medium", 
    chapter: "Chapter 2",
    module: "All SAT Math",
    bookmarked: false,
    examNumber: 2,
    choices: ["10", "11", "12", "13"],
    correctAnswer: "12",
    explanation: "Use the mean formula to find the missing value",
    solutionSteps: [
      "Mean = Sum ÷ Count, so 12 = Sum ÷ 5",
      "Therefore Sum = 60",
      "Sum of known numbers: 8 + 10 + 14 + 16 = 48", 
      "Fifth number = 60 - 48 = 12"
    ]
  },

  // Math Questions - Chapter 3: Passport to Advanced Math
  {
    id: "MATH-005",
    number: 5,
    content: "If f(x) = x² + 3x - 2, what is f(-1)?",
    solution: "f(-1) = (-1)² + 3(-1) - 2 = 1 - 3 - 2 = -4",
    difficulty: "medium",
    chapter: "Chapter 3",
    module: "All SAT Math",
    bookmarked: false,
    examNumber: 3,
    choices: ["-6", "-4", "-2", "0"],
    correctAnswer: "-4", 
    explanation: "Substitute x = -1 into the function",
    solutionSteps: [
      "Given: f(x) = x² + 3x - 2",
      "Substitute x = -1: f(-1) = (-1)² + 3(-1) - 2",
      "Calculate: f(-1) = 1 - 3 - 2 = -4"
    ]
  },
  {
    id: "MATH-006",
    number: 6,
    content: "What is the area of a circle with radius 5 cm?",
    solution: "Using the formula A = πr², the area is calculated as 25π cm²",
    difficulty: "medium",
    chapter: "Chapter 3",
    module: "All SAT Math",
    bookmarked: false,
    examNumber: 3,
    choices: ["25π cm²", "10π cm²", "5π cm²", "100π cm²"],
    correctAnswer: "25π cm²",
    explanation: "Use the circle area formula A = πr²",
    solutionSteps: [
      "Start with the area formula: A = πr²",
      "Substitute the radius: r = 5cm", 
      "Calculate: A = π(5)² = 25π cm²"
    ]
  },

  // Reading Questions - Chapter 4: Reading Comprehension
  {
    id: "READ-001",
    number: 7,
    content: "Based on the passage, the author's primary purpose is to:",
    solution: "The author aims to inform readers about climate change effects",
    difficulty: "medium",
    chapter: "Chapter 4",
    module: "SAT Reading",
    bookmarked: false,
    examNumber: 4,
    choices: [
      "Entertain readers with stories",
      "Persuade readers to take action", 
      "Inform about climate change effects",
      "Compare different viewpoints"
    ],
    correctAnswer: "Inform about climate change effects",
    explanation: "The passage presents factual information about climate impacts",
    solutionSteps: [
      "Identify the passage's main theme",
      "Look for the author's intent signals",
      "Determine if the purpose is to inform, persuade, or entertain"
    ]
  },
  {
    id: "READ-002", 
    number: 8,
    content: "Which choice best describes the relationship between the two passages?",
    solution: "The passages present contrasting viewpoints on the same topic",
    difficulty: "hard",
    chapter: "Chapter 4", 
    module: "SAT Reading",
    bookmarked: false,
    examNumber: 4,
    choices: [
      "They support the same conclusion",
      "They present contrasting viewpoints",
      "One passage refutes the other completely", 
      "They discuss unrelated topics"
    ],
    correctAnswer: "They present contrasting viewpoints",
    explanation: "Look for opposing arguments or different perspectives",
    solutionSteps: [
      "Identify the main argument in each passage",
      "Compare the authors' positions",
      "Determine the relationship between their viewpoints"
    ]
  },

  // Writing Questions - Chapter 5: Writing and Language
  {
    id: "WRITE-001",
    number: 9,
    content: "Which choice provides the most effective transition between sentences?",
    solution: "However, provides the best contrast between the ideas",
    difficulty: "medium", 
    chapter: "Chapter 5",
    module: "SAT Writing",
    bookmarked: false,
    examNumber: 5,
    choices: [
      "Therefore,", 
      "However,",
      "In addition,",
      "For example,"
    ],
    correctAnswer: "However,",
    explanation: "The context requires a contrasting transition word",
    solutionSteps: [
      "Identify the relationship between sentences",
      "Determine if contrast, addition, or example is needed", 
      "Choose the appropriate transition word"
    ]
  },
  {
    id: "WRITE-002",
    number: 10,
    content: "Which choice maintains the sentence's focus on environmental benefits?",
    solution: "The revision should emphasize ecological advantages",
    difficulty: "medium",
    chapter: "Chapter 5", 
    module: "SAT Writing",
    bookmarked: false,
    examNumber: 5,
    choices: [
      "Solar panels reduce electricity costs significantly",
      "Solar panels provide clean, renewable energy",
      "Solar panels are becoming more affordable",
      "Solar panels require minimal maintenance"
    ],
    correctAnswer: "Solar panels provide clean, renewable energy",
    explanation: "This choice directly addresses environmental benefits",
    solutionSteps: [
      "Identify the sentence's intended focus",
      "Eliminate options that shift to other topics",
      "Choose the option that best maintains the environmental theme"
    ]
  },

  // Additional questions for each exam to ensure no "unavailable" messages
  {
    id: "MATH-007",
    number: 11,
    content: "Solve for y: 2y - 8 = 14",
    solution: "2y - 8 = 14, add 8: 2y = 22, divide by 2: y = 11",
    difficulty: "easy",
    chapter: "Chapter 1",
    module: "All SAT Math", 
    bookmarked: false,
    examNumber: 1,
    choices: ["9", "10", "11", "12"],
    correctAnswer: "11",
    explanation: "Isolate y using inverse operations",
    solutionSteps: [
      "Start with: 2y - 8 = 14",
      "Add 8 to both sides: 2y = 22",
      "Divide by 2: y = 11"
    ]
  },
  {
    id: "MATH-008",
    number: 12,
    content: "What is 25% of 80?", 
    solution: "25% of 80 = 0.25 × 80 = 20",
    difficulty: "easy",
    chapter: "Chapter 2",
    module: "All SAT Math",
    bookmarked: false,
    examNumber: 2,
    choices: ["15", "20", "25", "30"],
    correctAnswer: "20",
    explanation: "Convert percentage to decimal and multiply",
    solutionSteps: [
      "Convert 25% to decimal: 0.25",
      "Multiply: 0.25 × 80 = 20"
    ]
  },
  {
    id: "MATH-009",
    number: 13,
    content: "Simplify: (x + 3)(x - 2)",
    solution: "(x + 3)(x - 2) = x² - 2x + 3x - 6 = x² + x - 6",
    difficulty: "medium",
    chapter: "Chapter 3",
    module: "All SAT Math",
    bookmarked: false,
    examNumber: 3,
    choices: ["x² - x - 6", "x² + x - 6", "x² - x + 6", "x² + x + 6"],
    correctAnswer: "x² + x - 6",
    explanation: "Use FOIL method to expand",
    solutionSteps: [
      "First: x × x = x²",
      "Outer: x × (-2) = -2x", 
      "Inner: 3 × x = 3x",
      "Last: 3 × (-2) = -6",
      "Combine: x² - 2x + 3x - 6 = x² + x - 6"
    ]
  },
  {
    id: "READ-003",
    number: 14,
    content: "The author uses the metaphor of 'a bridge between worlds' to:",
    solution: "The metaphor emphasizes connection and transition between different concepts",
    difficulty: "medium",
    chapter: "Chapter 4",
    module: "SAT Reading",
    bookmarked: false,
    examNumber: 4,
    choices: [
      "Show physical distance",
      "Emphasize connection between concepts",
      "Describe architectural features",
      "Illustrate time progression"
    ],
    correctAnswer: "Emphasize connection between concepts",
    explanation: "Metaphors create comparisons to convey deeper meaning",
    solutionSteps: [
      "Identify what the metaphor compares",
      "Consider the context and purpose",
      "Determine the intended meaning or effect"
    ]
  },
  {
    id: "WRITE-003",
    number: 15,
    content: "Which choice correctly uses parallel structure?",
    solution: "The sentence should maintain consistent grammatical form",
    difficulty: "medium",
    chapter: "Chapter 5",
    module: "SAT Writing",
    bookmarked: false,
    examNumber: 5,
    choices: [
      "She enjoys reading, writing, and to paint",
      "She enjoys reading, writing, and painting", 
      "She enjoys to read, writing, and painting",
      "She enjoys reading, to write, and painting"
    ],
    correctAnswer: "She enjoys reading, writing, and painting",
    explanation: "All items in the series should have the same grammatical form",
    solutionSteps: [
      "Identify the series of items",
      "Check that all items use the same grammatical structure",
      "Ensure parallel construction throughout"
    ]
  },

  // Additional SAT Reading questions for better module coverage
  {
    id: "READ-004",
    number: 16,
    content: "In the context of the passage, what does the author mean by 'a watershed moment'?",
    solution: "The author uses 'watershed moment' to describe a critical turning point that changed everything",
    difficulty: "medium",
    chapter: "Chapter 1",
    module: "SAT Reading",
    bookmarked: false,
    examNumber: 1,
    choices: [
      "A moment near water",
      "A critical turning point",
      "A confused situation", 
      "A celebratory event"
    ],
    correctAnswer: "A critical turning point",
    explanation: "Watershed moment is an idiom meaning a pivotal point in time",
    solutionSteps: [
      "Identify the phrase in context",
      "Consider figurative vs literal meaning",
      "Choose the meaning that fits the passage's tone"
    ]
  },
  {
    id: "READ-005", 
    number: 17,
    content: "The data in the graph supports which claim from the passage?",
    solution: "The graph shows increasing trends that support the author's argument about growth",
    difficulty: "hard",
    chapter: "Chapter 2",
    module: "SAT Reading",
    bookmarked: false,
    examNumber: 2,
    choices: [
      "Technology adoption is slowing down",
      "Growth rates are increasing steadily",
      "There are no clear patterns",
      "The data contradicts the text"
    ],
    correctAnswer: "Growth rates are increasing steadily",
    explanation: "Look for correlation between visual data and textual claims",
    solutionSteps: [
      "Identify the relevant claim in the passage",
      "Examine the graph data carefully",
      "Match the data trend to the textual argument"
    ]
  },
  {
    id: "READ-006",
    number: 18, 
    content: "Which choice best maintains the cohesive focus of the paragraph?",
    solution: "The sentence should relate directly to the main topic without introducing new themes",
    difficulty: "medium",
    chapter: "Chapter 3",
    module: "SAT Reading",
    bookmarked: false,
    examNumber: 3,
    choices: [
      "Scientists have made remarkable discoveries lately",
      "The research confirms our initial hypothesis about ocean temperatures",
      "Many people enjoy swimming in the ocean",
      "Funding for research projects varies significantly"
    ],
    correctAnswer: "The research confirms our initial hypothesis about ocean temperatures",
    explanation: "This choice directly relates to the paragraph's research focus",
    solutionSteps: [
      "Identify the paragraph's main topic",
      "Eliminate choices that introduce new themes", 
      "Select the choice that best supports the focus"
    ]
  },

  // Additional SAT Writing questions for better module coverage
  {
    id: "WRITE-004",
    number: 19,
    content: "Which choice results in the most effective sentence?",
    solution: "The most concise and clear option without redundancy",
    difficulty: "medium",
    chapter: "Chapter 1", 
    module: "SAT Writing",
    bookmarked: false,
    examNumber: 1,
    choices: [
      "The student's performance was really very exceptionally outstanding",
      "The student's performance was exceptional",
      "The student's performance was really exceptional and outstanding",
      "The performance of the student was very exceptionally outstanding"
    ],
    correctAnswer: "The student's performance was exceptional",
    explanation: "Eliminate redundant words and phrases for clarity",
    solutionSteps: [
      "Identify redundant or unnecessary words",
      "Choose the most concise option",
      "Ensure the meaning remains clear"
    ]
  },
  {
    id: "WRITE-005",
    number: 20,
    content: "Should the writer add this sentence to the paragraph?",
    solution: "Evaluate whether the sentence supports the paragraph's purpose and maintains focus",
    difficulty: "medium",
    chapter: "Chapter 2",
    module: "SAT Writing", 
    bookmarked: false,
    examNumber: 2,
    choices: [
      "Yes, because it provides essential background information",
      "Yes, because it creates an interesting contrast",
      "No, because it contradicts information presented earlier",
      "No, because it introduces an irrelevant detail"
    ],
    correctAnswer: "No, because it introduces an irrelevant detail",
    explanation: "The sentence doesn't support the paragraph's main focus",
    solutionSteps: [
      "Identify the paragraph's main purpose",
      "Determine if the sentence supports that purpose",
      "Consider whether it adds value or creates distraction"
    ]
  },
  {
    id: "WRITE-006",
    number: 21,
    content: "Which choice correctly punctuates the sentence?",
    solution: "Use proper comma placement for clarity and grammatical correctness",
    difficulty: "easy",
    chapter: "Chapter 3",
    module: "SAT Writing",
    bookmarked: false,
    examNumber: 3,
    choices: [
      "Although the weather was cold, we decided to go hiking.",
      "Although the weather was cold we decided to go hiking.",
      "Although, the weather was cold, we decided to go hiking.",
      "Although the weather was cold, we decided, to go hiking."
    ],
    correctAnswer: "Although the weather was cold, we decided to go hiking.",
    explanation: "Use a comma after an introductory dependent clause",
    solutionSteps: [
      "Identify the dependent clause",
      "Place comma after the introductory clause",
      "Ensure no unnecessary commas are added"
    ]
  },
  {
    id: "WRITE-007",
    number: 22,
    content: "Which choice best combines the two sentences?",
    solution: "Create a smooth, logical connection between related ideas",
    difficulty: "medium",
    chapter: "Chapter 4",
    module: "SAT Writing",
    bookmarked: false,
    examNumber: 4,
    choices: [
      "The experiment failed, and the results were inconclusive, but we learned valuable lessons.",
      "The experiment failed; however, we learned valuable lessons from the inconclusive results.",
      "Although the experiment failed and results were inconclusive, we learned valuable lessons.",
      "The experiment failed, the results were inconclusive, we learned valuable lessons."
    ],
    correctAnswer: "Although the experiment failed and results were inconclusive, we learned valuable lessons.",
    explanation: "This choice creates the clearest logical relationship",
    solutionSteps: [
      "Identify the relationship between the ideas",
      "Choose appropriate connecting words",
      "Ensure proper punctuation and flow"
    ]
  },
  {
    id: "WRITE-008",
    number: 23,
    content: "Which choice provides the most precise word?",
    solution: "Select the word that best fits the specific context and meaning",
    difficulty: "medium", 
    chapter: "Chapter 5",
    module: "SAT Writing",
    bookmarked: false,
    examNumber: 5,
    choices: [
      "The scientist found the results",
      "The scientist discovered the results", 
      "The scientist obtained the results",
      "The scientist got the results"
    ],
    correctAnswer: "The scientist obtained the results",
    explanation: "Obtained is most precise for acquiring research results",
    solutionSteps: [
      "Consider the specific context",
      "Evaluate the precision of each word choice",
      "Select the most appropriate and precise option"
    ]
  }
];

export default comprehensiveSampleQuestions;