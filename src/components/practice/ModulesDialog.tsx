import { useState, useEffect } from "react";
import { BookOpen, ChevronDown, Loader2, AlertCircle, CheckCircle } from "lucide-react";
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
import { useQuestions } from "@/contexts/QuestionsContext";

interface ModelTest {
  id: number;
  title: string;
  description: string;
  completionRate: number;
  questions?: Question[];
  isLoading?: boolean;
  hasError?: boolean;
  questionCount?: number;
}

const ModulesDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingTestId, setFetchingTestId] = useState<number | null>(null);
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  const { setQuestions } = useQuestions();
  
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
    setFetchingTestId(testId);
    setIsLoading(true);
    
    // Update the specific test loading state
    setModelTests(prev => prev.map(test => 
      test.id === testId 
        ? { ...test, isLoading: true, hasError: false }
        : test
    ));
    
    try {
      console.log(`Fetching questions for Model Test ${testId} from get-sat-math-questions endpoint...`);
      
      const { data, error } = await callEdgeFunction<any>('get-sat-math-questions');
      
      if (error || !data) {
        throw new Error(error?.message || 'Failed to fetch questions from endpoint');
      }

      console.log('Raw data received:', data);

      // Handle different possible data structures from the endpoint
      let rawQuestions: any[] = [];
      
      // Try to extract questions from various possible response formats
      if (data.questions && Array.isArray(data.questions)) {
        rawQuestions = data.questions;
      } else if (Array.isArray(data)) {
        rawQuestions = data;
      } else if (data.data && Array.isArray(data.data)) {
        rawQuestions = data.data;
      } else if (data.results && Array.isArray(data.results)) {
        rawQuestions = data.results;
      } else {
        console.warn('Unexpected data format:', data);
        throw new Error('Questions data is not in expected format');
      }

      console.log(`Found ${rawQuestions.length} raw questions`);

      if (rawQuestions.length === 0) {
        throw new Error('No questions found in the response');
      }

      // Use the mapping utility to normalize the questions
      const mappedQuestions = mapQuestions(rawQuestions);
      console.log(`Mapped ${mappedQuestions.length} questions`);
      
      // Validate the mapped questions
      const validQuestions = mappedQuestions.filter(validateQuestion);
      console.log(`${validQuestions.length} questions passed validation`);
      
      if (validQuestions.length === 0) {
        throw new Error('No valid questions found after processing');
      }

      // Update the specific test with the fetched questions
      setModelTests(prev => prev.map(test => 
        test.id === testId 
          ? { 
              ...test, 
              questions: validQuestions, 
              questionCount: validQuestions.length,
              isLoading: false,
              hasError: false 
            }
          : test
      ));

      // Set the questions in the global context to display in practice
      setQuestions(validQuestions);

      // Close the dropdown after successful load
      setIsOpen(false);

      toast({
        title: "Exam Questions Loaded Successfully!",
        description: `Loaded ${validQuestions.length} questions for ${modelTests.find(t => t.id === testId)?.title}. Practice session ready.`,
      });

    } catch (error) {
      console.error(`Error fetching questions for Model Test ${testId}:`, error);
      
      // Update the specific test with error state
      setModelTests(prev => prev.map(test => 
        test.id === testId 
          ? { ...test, isLoading: false, hasError: true }
          : test
      ));

      toast({
        title: "Failed to Load Exam Questions",
        description: error instanceof Error ? error.message : `Failed to load questions for Model Test ${testId}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setFetchingTestId(null);
    }
  };

  const handleTestClick = async (test: ModelTest) => {
    if (test.isLoading) return; // Prevent double-clicks
    
    console.log(`Starting Model Test ${test.id}...`);
    await fetchQuestionsForTest(test.id);
  };

  const getTestStatusIcon = (test: ModelTest) => {
    if (test.isLoading) {
      return <Loader2 className={`h-4 w-4 animate-spin ${isDarkMode ? 'text-green-400' : 'text-blue-500'}`} />;
    }
    
    if (test.hasError) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    
    if (test.questions && test.questions.length > 0) {
      return <CheckCircle className={`h-4 w-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />;
    }
    
    return null;
  };

  const getTestStatusText = (test: ModelTest) => {
    if (test.isLoading) {
      return "Loading...";
    }
    
    if (test.hasError) {
      return "Error";
    }
    
    if (test.questions && test.questions.length > 0) {
      return `${test.questions.length} Q's`;
    }
    
    if (test.completionRate > 0) {
      return `${test.completionRate}%`;
    }
    
    return "Start";
  };

  const getTestStatusColor = (test: ModelTest) => {
    if (test.isLoading) {
      return isDarkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600';
    }
    
    if (test.hasError) {
      return 'bg-red-600/20 text-red-400';
    }
    
    if (test.questions && test.questions.length > 0) {
      return isDarkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-50 text-green-600';
    }
    
    if (test.completionRate > 0) {
      return isDarkMode ? 'bg-green-600/20 text-green-400' : 'bg-[#F2FCE2] text-[#166534]';
    }
    
    return isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500';
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
          disabled={isLoading}
        >
          <BookOpen className={`h-4 w-4 mr-1.5 ${isDarkMode ? 'text-green-400' : 'text-blue-500'}`} />
          <span className={isDarkMode ? 'text-green-400' : 'text-gray-700'}>
            {isLoading ? 'Loading...' : 'Exams'}
          </span>
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
                  test.isLoading 
                    ? 'opacity-50 cursor-not-allowed'
                    : isDarkMode 
                      ? 'hover:bg-gray-800 border-green-500/20 hover:border-green-500/40' 
                      : 'hover:bg-gray-50 border-gray-100 hover:border-gray-200'
                }`}
                onClick={() => !test.isLoading && handleTestClick(test)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-source-sans font-medium text-sm ${
                    isDarkMode ? 'text-green-400' : 'text-[#304455]'
                  }`}>
                    {test.title}
                  </span>
                  <div className="flex items-center gap-2">
                    {getTestStatusIcon(test)}
                    <span className={`text-xs px-2 py-1 rounded-full ${getTestStatusColor(test)}`}>
                      {getTestStatusText(test)}
                    </span>
                  </div>
                </div>
                
                <p className={`text-xs ${isDarkMode ? 'text-green-500' : 'text-gray-600'}`}>
                  {test.description}
                </p>
                
                {/* Progress bar for tests with completion rate */}
                {test.completionRate > 0 && !test.questions && (
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

                {/* Success message for loaded questions */}
                {test.questions && test.questions.length > 0 && (
                  <div className={`mt-2 text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    ✓ Questions loaded and ready for practice
                  </div>
                )}

                {/* Error message */}
                {test.hasError && (
                  <div className="mt-2 text-xs text-red-500">
                    ✗ Failed to load questions. Click to retry.
                  </div>
                )}

                {/* Loading indicator */}
                {test.isLoading && (
                  <div className={`mt-2 text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Loading questions from endpoint...
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
            {isLoading ? 'Loading questions...' : 'View all model tests'}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModulesDialog;
