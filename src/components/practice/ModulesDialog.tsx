
import { useState } from "react";
import { BookOpen, ChevronDown, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/components/ui/use-toast";
import { useQuestions } from "@/contexts/QuestionsContext";
import { Question } from "@/types/QuestionInterface";

interface ModelTest {
  id: number;
  title: string;
  description: string;
  completionRate: number;
}

interface ModulesDialogProps {
  onFilterChange?: (filters: { exam?: number }) => void;
}

const ModulesDialog = ({ onFilterChange }: ModulesDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<number | null>(null);
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  const { questions } = useQuestions();
  
  const modelTests: ModelTest[] = [
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
  ];

  const handleTestClick = (test: ModelTest) => {
    console.log(`Filtering questions for Model Test ${test.id}...`);
    
    // Filter questions by exam number
    const examQuestions = questions.filter(q => q.examNumber === test.id);
    
    setSelectedExam(test.id);
    
    // Call the filter change callback
    if (onFilterChange) {
      onFilterChange({ exam: test.id });
    }
    
    // Close the dropdown after selection
    setIsOpen(false);

    toast({
      title: "Exam Filter Applied!",
      description: `Showing ${examQuestions.length} questions from ${test.title}.`,
    });
  };

  const getQuestionCount = (examId: number): number => {
    return questions.filter(q => q.examNumber === examId).length;
  };

  const getTestStatusText = (test: ModelTest) => {
    const questionCount = getQuestionCount(test.id);
    
    if (questionCount > 0) {
      return `${questionCount} Q's`;
    }
    
    if (test.completionRate > 0) {
      return `${test.completionRate}%`;
    }
    
    return "Start";
  };

  const getTestStatusColor = (test: ModelTest) => {
    const questionCount = getQuestionCount(test.id);
    
    if (questionCount > 0) {
      return isDarkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-50 text-green-600';
    }
    
    if (test.completionRate > 0) {
      return isDarkMode ? 'bg-green-600/20 text-green-400' : 'bg-[#F2FCE2] text-[#166534]';
    }
    
    return isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500';
  };

  const clearExamFilter = () => {
    setSelectedExam(null);
    if (onFilterChange) {
      onFilterChange({});
    }
    setIsOpen(false);
    toast({
      title: "Filter Cleared",
      description: "Showing all available questions.",
    });
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
          <span className={isDarkMode ? 'text-green-400' : 'text-gray-700'}>
            {selectedExam ? `Exam ${selectedExam}` : 'Exams'}
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
            Filter questions by exam number
          </p>
        </div>

        {selectedExam && (
          <div className="mb-3">
            <Button 
              variant="outline" 
              size="sm" 
              className={`w-full text-sm ${
                isDarkMode ? 'border-green-500/30 text-green-400 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={clearExamFilter}
            >
              Clear Filter (Show All Questions)
            </Button>
          </div>
        )}
        
        <ScrollArea className="h-[400px] pr-2">
          <div className="space-y-2">
            {modelTests.map((test) => (
              <motion.div 
                key={test.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: test.id * 0.02 }}
                className={`py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                  selectedExam === test.id
                    ? isDarkMode 
                      ? 'bg-green-600/20 border-green-500/40' 
                      : 'bg-green-50 border-green-200'
                    : isDarkMode 
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
                    {selectedExam === test.id && (
                      <CheckCircle className={`h-4 w-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full ${getTestStatusColor(test)}`}>
                      {getTestStatusText(test)}
                    </span>
                  </div>
                </div>
                
                <p className={`text-xs ${isDarkMode ? 'text-green-500' : 'text-gray-600'}`}>
                  {test.description}
                </p>
                
                {test.completionRate > 0 && getQuestionCount(test.id) === 0 && (
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

                {getQuestionCount(test.id) > 0 && (
                  <div className={`mt-2 text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    ✓ {getQuestionCount(test.id)} questions available
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
          >
            View all model tests
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModulesDialog;
