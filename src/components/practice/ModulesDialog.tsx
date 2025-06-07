
import { useState, useEffect } from "react";
import { BookOpen, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { callEdgeFunction } from "@/services/edgeFunctionService";
import { mapQuestions, validateQuestion } from "@/utils/mapQuestion";
import { Question } from "@/types/QuestionInterface";
import { useToast } from "@/components/ui/use-toast";

interface ModelTest {
  id: number;
  title: string;
  description: string;
  completionRate: number;
  questions?: Question[];
}

const ModulesDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  
  const [modelTests, setModelTests] = useState<ModelTest[]>([
    {
      id: 1,
      title: "Model Test 1",
      description: "Comprehensive SAT practice test",
      completionRate: 85
    },
    {
      id: 2,
      title: "Model Test 2",
      description: "Advanced problem-solving scenarios",
      completionRate: 75
    },
    {
      id: 3,
      title: "Model Test 3",
      description: "Reading comprehension focus",
      completionRate: 60
    },
    {
      id: 4,
      title: "Model Test 4",
      description: "Mathematical reasoning test",
      completionRate: 40
    },
    {
      id: 5,
      title: "Model Test 5",
      description: "Writing and language skills",
      completionRate: 30
    },
    {
      id: 6,
      title: "Model Test 6",
      description: "Critical analysis practice",
      completionRate: 20
    },
    {
      id: 7,
      title: "Model Test 7",
      description: "Data interpretation focus",
      completionRate: 15
    },
    {
      id: 8,
      title: "Model Test 8",
      description: "Essay writing preparation",
      completionRate: 10
    },
    {
      id: 9,
      title: "Model Test 9",
      description: "Science reasoning test",
      completionRate: 5
    },
    {
      id: 10,
      title: "Model Test 10",
      description: "Advanced mathematics",
      completionRate: 0
    },
    {
      id: 11,
      title: "Model Test 11",
      description: "Literature analysis",
      completionRate: 0
    },
    {
      id: 12,
      title: "Model Test 12",
      description: "Final comprehensive exam",
      completionRate: 0
    }
  ]);

  const fetchQuestionsForTest = async (testId: number) => {
    setIsLoading(true);
    try {
      console.log(`Fetching questions for Model Test ${testId} from get-sat-math-questions endpoint...`);
      
      const { data, error } = await callEdgeFunction<any>('get-sat-math-questions');
      
      if (error || !data) {
        throw new Error(error?.message || 'Failed to fetch questions');
      }

      // Handle different possible data structures from the endpoint
      let rawQuestions: any[] = [];
      if (data.questions && Array.isArray(data.questions)) {
        rawQuestions = data.questions;
      } else if (Array.isArray(data)) {
        rawQuestions = data;
      } else if (data.data && Array.isArray(data.data)) {
        rawQuestions = data.data;
      }

      // Use the mapping utility to normalize the questions
      const mappedQuestions = mapQuestions(rawQuestions);
      
      // Validate the mapped questions
      const validQuestions = mappedQuestions.filter(validateQuestion);
      
      console.log(`Successfully loaded ${validQuestions.length} questions for Model Test ${testId}`);
      
      // Update the specific test with the fetched questions
      setModelTests(prev => prev.map(test => 
        test.id === testId 
          ? { ...test, questions: validQuestions }
          : test
      ));

      toast({
        title: "Questions Loaded",
        description: `Loaded ${validQuestions.length} questions for Model Test ${testId}`,
      });

    } catch (error) {
      console.error(`Error fetching questions for Model Test ${testId}:`, error);
      toast({
        title: "Error",
        description: `Failed to load questions for Model Test ${testId}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestClick = async (test: ModelTest) => {
    if (!test.questions) {
      await fetchQuestionsForTest(test.id);
    } else {
      console.log(`Model Test ${test.id} already has ${test.questions.length} questions loaded`);
      toast({
        title: "Questions Ready",
        description: `Model Test ${test.id} has ${test.questions.length} questions ready`,
      });
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-full bg-transparent transition-colors ${
            isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
        >
          <BookOpen className={`h-4 w-4 mr-1.5 ${isDarkMode ? 'text-green-400' : 'text-blue-500'}`} />
          <span className={isDarkMode ? 'text-green-400' : 'text-gray-700'}>Exams</span>
          <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""} ${isDarkMode ? 'text-green-400' : 'text-gray-600'}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={`w-80 max-h-[500px] shadow-lg rounded-lg p-3 z-50 ${
          isDarkMode ? 'bg-gray-900 border-green-500/30' : 'bg-white border-gray-200'
        }`}
      >
        <div className="mb-3">
          <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-green-400' : 'text-gray-900'}`}>
            SAT Model Tests
          </h3>
          <p className={`text-xs ${isDarkMode ? 'text-green-500' : 'text-gray-600'}`}>
            Practice with comprehensive model exams
          </p>
        </div>
        
        <ScrollArea className="h-[400px] pr-2">
          <div className="space-y-2">
            {modelTests.map((test) => (
              <motion.div 
                key={test.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: test.id * 0.02 }}
                className={`py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                  isDarkMode 
                    ? 'hover:bg-gray-800 border-green-500/20 hover:border-green-500/40' 
                    : 'hover:bg-gray-50 border-gray-100 hover:border-gray-200'
                }`}
                onClick={() => handleTestClick(test)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-source-sans font-medium text-sm ${
                    isDarkMode ? 'text-green-400' : 'text-[#304455]'
                  }`}>
                    {test.title}
                  </span>
                  <div className="flex items-center gap-2">
                    {isLoading && (
                      <Loader2 className={`h-3 w-3 animate-spin ${
                        isDarkMode ? 'text-green-400' : 'text-blue-500'
                      }`} />
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      test.questions 
                        ? isDarkMode 
                          ? 'bg-blue-600/20 text-blue-400' 
                          : 'bg-blue-50 text-blue-600'
                        : test.completionRate > 0 
                          ? isDarkMode 
                            ? 'bg-green-600/20 text-green-400' 
                            : 'bg-[#F2FCE2] text-[#166534]'
                          : isDarkMode 
                            ? 'bg-gray-700 text-gray-400' 
                            : 'bg-gray-100 text-gray-500'
                    }`}>
                      {test.questions 
                        ? `${test.questions.length} Q's` 
                        : test.completionRate > 0 
                          ? `${test.completionRate}%` 
                          : 'New'}
                    </span>
                  </div>
                </div>
                
                <p className={`text-xs ${isDarkMode ? 'text-green-500' : 'text-gray-600'}`}>
                  {test.description}
                </p>
                
                {test.completionRate > 0 && (
                  <div className={`mt-2 w-full h-1.5 rounded-full ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isDarkMode ? 'bg-green-500' : 'bg-green-600'
                      }`}
                      style={{ width: `${test.completionRate}%` }}
                    />
                  </div>
                )}

                {test.questions && (
                  <div className={`mt-2 text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Questions loaded and ready for practice
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </ScrollArea>
        
        <div className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-green-500/30' : 'border-gray-200'}`}>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`w-full text-center text-sm ${
              isDarkMode ? 'text-green-400 hover:text-green-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'View all model tests'}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModulesDialog;
