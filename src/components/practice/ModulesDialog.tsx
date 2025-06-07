
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
import { useToast } from "@/components/ui/use-toast";
import { useQuestions } from "@/contexts/QuestionsContext";

interface ExamTest {
  id: number;
  title: string;
  description: string;
  completionRate: number;
  examNumber: number;
}

interface ModulesDialogProps {
  onExamFilter?: (examNumber: number | null) => void;
}

const ModulesDialog = ({ onExamFilter }: ModulesDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  const { questions } = useQuestions();
  
  const [examTests] = useState<ExamTest[]>([
    { id: 1, title: "Exam 1", description: "Comprehensive SAT practice test", completionRate: 85, examNumber: 1 },
    { id: 2, title: "Exam 2", description: "Advanced problem-solving scenarios", completionRate: 75, examNumber: 2 },
    { id: 3, title: "Exam 3", description: "Reading comprehension focus", completionRate: 60, examNumber: 3 },
    { id: 4, title: "Exam 4", description: "Mathematical reasoning test", completionRate: 40, examNumber: 4 },
    { id: 5, title: "Exam 5", description: "Writing and language skills", completionRate: 30, examNumber: 5 },
    { id: 6, title: "Exam 6", description: "Critical analysis practice", completionRate: 20, examNumber: 6 },
    { id: 7, title: "Exam 7", description: "Data interpretation focus", completionRate: 15, examNumber: 7 },
    { id: 8, title: "Exam 8", description: "Essay writing preparation", completionRate: 10, examNumber: 8 },
    { id: 9, title: "Exam 9", description: "Science reasoning test", completionRate: 5, examNumber: 9 },
    { id: 10, title: "Exam 10", description: "Advanced mathematics", completionRate: 0, examNumber: 10 },
    { id: 11, title: "Exam 11", description: "Literature analysis", completionRate: 0, examNumber: 11 },
    { id: 12, title: "Exam 12", description: "Final comprehensive exam", completionRate: 0, examNumber: 12 }
  ]);

  const handleExamClick = (exam: ExamTest) => {
    console.log(`Filtering by Exam ${exam.examNumber}...`);
    
    // Filter questions by exam number
    const examQuestions = questions.filter(q => q.examNumber === exam.examNumber);
    
    if (examQuestions.length === 0) {
      toast({
        title: "No Questions Found",
        description: `No questions found for ${exam.title}. Please ensure questions are loaded.`,
        variant: "destructive",
      });
      return;
    }

    // Apply exam filter
    if (onExamFilter) {
      onExamFilter(exam.examNumber);
    }
    
    setIsOpen(false);
    
    toast({
      title: "Exam Filter Applied",
      description: `Filtered to ${examQuestions.length} questions from ${exam.title}`,
    });
  };

  const handleShowAllExams = () => {
    if (onExamFilter) {
      onExamFilter(null);
    }
    setIsOpen(false);
    
    toast({
      title: "Filter Cleared",
      description: "Showing all available questions",
    });
  };

  const getExamQuestionCount = (examNumber: number) => {
    return questions.filter(q => q.examNumber === examNumber).length;
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
            Exams
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
            SAT Exam Filters
          </h3>
          <p className={`text-xs ${isDarkMode ? 'text-green-500' : 'text-gray-600'}`}>
            Filter questions by exam number
          </p>
        </div>
        
        <ScrollArea className="h-[400px] pr-2">
          <div className="space-y-2">
            {/* Show All Option */}
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                isDarkMode 
                  ? 'hover:bg-gray-800 border-green-500/20 hover:border-green-500/40' 
                  : 'hover:bg-gray-50 border-gray-100 hover:border-gray-200'
              }`}
              onClick={handleShowAllExams}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-source-sans font-medium text-sm ${
                  isDarkMode ? 'text-green-400' : 'text-[#304455]'
                }`}>
                  All Exams
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                }`}>
                  {questions.length} Q's
                </span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-green-500' : 'text-gray-600'}`}>
                Show questions from all exams
              </p>
            </motion.div>

            {examTests.map((exam) => {
              const questionCount = getExamQuestionCount(exam.examNumber);
              
              return (
                <motion.div 
                  key={exam.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: exam.id * 0.02 }}
                  className={`py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                    isDarkMode 
                      ? 'hover:bg-gray-800 border-green-500/20 hover:border-green-500/40' 
                      : 'hover:bg-gray-50 border-gray-100 hover:border-gray-200'
                  }`}
                  onClick={() => handleExamClick(exam)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-source-sans font-medium text-sm ${
                      isDarkMode ? 'text-green-400' : 'text-[#304455]'
                    }`}>
                      {exam.title}
                    </span>
                    <div className="flex items-center gap-2">
                      {questionCount > 0 && (
                        <CheckCircle className={`h-4 w-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        questionCount > 0 
                          ? (isDarkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-50 text-green-600')
                          : (isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')
                      }`}>
                        {questionCount > 0 ? `${questionCount} Q's` : 'No Q\'s'}
                      </span>
                    </div>
                  </div>
                  
                  <p className={`text-xs ${isDarkMode ? 'text-green-500' : 'text-gray-600'}`}>
                    {exam.description}
                  </p>
                  
                  {exam.completionRate > 0 && (
                    <div className={`mt-2 w-full h-1.5 rounded-full ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isDarkMode ? 'bg-green-500' : 'bg-green-600'
                        }`}
                        style={{ width: `${exam.completionRate}%` }}
                      />
                    </div>
                  )}

                  {questionCount > 0 && (
                    <div className={`mt-2 text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      ✓ {questionCount} questions available
                    </div>
                  )}
                </motion.div>
              );
            })}
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
            Filter by exam to focus practice
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModulesDialog;
