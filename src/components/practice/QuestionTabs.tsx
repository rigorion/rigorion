import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "../ui/button";

// Define the types for difficulty levels and chapters
export type Difficulty = "beginner" | "medium" | "difficult";
export type Chapter = "Chapter 1" | "Chapter 2" | "Chapter 3" | "Chapter 4" | "Chapter 5";

// Define the Question interface
export interface Question {
  questions?: Question[];
  id: number;
  problem: string;
  solution: string;
  quote: string;
  choices: string[];
  difficulty: Difficulty;
  chapter: Chapter;
}

// Create the QUESTIONS array adhering to the Question interface
export const QUESTIONS: Question[] = [
  {
    id: 1,
    problem: "What is the probability of rolling a prime number on a fair 20-sided die?",
    solution: "Prime numbers between 1-20: 2, 3, 5, 7, 11, 13, 17, 19 (8 primes)\n\nProbability = 8/20 = 2/5 = 40%",
    quote: "Mathematics is the music of reason. - James Joseph Sylvester",
    choices: ["1/20", "2/5", "3/10", "1/4"],
    difficulty: "medium",
    chapter: "Chapter 1"
  },
  {
    id: 2,
    problem: "What's the area of a circle with radius 5 cm?",
    solution: "Using formula A = πr²\nA = π × 5² = 25π ≈ 78.54 cm²",
    quote: "Geometry is the archetype of the beauty of the world. - Johannes Kepler",
    choices: ["25π cm²", "10π cm²", "5π cm²", "100π cm²"],
    difficulty: "beginner",
    chapter: "Chapter 1"
  },
  {
    id: 3,
    problem: "Solve for x: 3(x + 5) = 2x + 20",
    solution: "3x + 15 = 2x + 20\n3x - 2x = 20 - 15\nx = 5",
    quote: "Algebra is the intellectual instrument which has been created for rendering clear the quantitative aspects of the world. - Alfred North Whitehead",
    choices: ["x = 3", "x = 5", "x = 7", "x = 15"],
    difficulty: "medium",
    chapter: "Chapter 2"
  },
  {
    id: 4,
    problem: "What's the derivative of f(x) = 3x² + 2x - 5?",
    solution: "Using power rule:\nf'(x) = d/dx(3x²) + d/dx(2x) - d/dx(5)\n= 6x + 2",
    quote: "Calculus is the most powerful weapon of thought yet devised. - William F. Osgood",
    choices: ["6x + 2", "3x² + 2", "6x", "3x + 2"],
    difficulty: "difficult",
    chapter: "Chapter 3"
  },
  {
    id: 5,
    problem: "What is 15% of 200?",
    solution: "15% × 200 = 0.15 × 200 = 30",
    quote: "Percentages are the alphabet of statistics. - Unknown",
    choices: ["20", "30", "40", "15"],
    difficulty: "beginner",
    chapter: "Chapter 1"
  }
];

// Function to filter questions based on chapter and difficulty
export const filterQuestions = (
  questions: Question[],
  chapter?: Chapter | "All Chapters",
  difficulty?: Difficulty | "All Levels"
): Question[] => {
  return questions.filter(q => 
    (chapter === "All Chapters" || chapter === undefined || q.chapter === chapter) &&
    (difficulty === "All Levels" || difficulty === undefined || q.difficulty === difficulty)
  );
};

// Define the props for the QuestionTabs component
interface QuestionTabsProps {
  currentIndex: number;
  activeTab: "problem" | "solution" | "quote";
  onTabChange: (tab: "problem" | "solution" | "quote") => void;
  onAnswerSelect: (questionIndex: number) => void;
}

// QuestionTabs component to display questions and their details
export const QuestionTabs = ({ 
  currentIndex,
  activeTab,
  onTabChange,
  onAnswerSelect
}: QuestionTabsProps) => {
  const question = QUESTIONS[currentIndex % QUESTIONS.length];

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={(value) => onTabChange(value as "problem" | "solution" | "quote")} 
      className="w-full"
    >
      {/* Removed TabsList since we're controlling tabs from QuestionActions */}
      
      <TabsContent value="problem" className="mt-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border min-h-[200px]">
          <h3 className="text-2xl font-semibold mb-8 text-center text-gray-800">
            {question.problem}
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {question.choices?.map((choice, index) => (
              <Button 
                key={index}
                variant="outline" 
                className="h-14 text-lg"
                onClick={() => onAnswerSelect(currentIndex)}
              >
                {choice}
              </Button>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="solution" className="mt-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border min-h-[400px]">
          <p className="text-gray-700 whitespace-pre-line">
            {question.solution}
          </p>
        </div>
      </TabsContent>

      <TabsContent value="quote" className="mt-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border min-h-[400px]">
          <blockquote className="text-gray-700 italic">
            {question.quote}
          </blockquote>
        </div>
      </TabsContent>
    </Tabs>
  );
};
