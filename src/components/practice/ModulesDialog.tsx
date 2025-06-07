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
  currentExamFilter?: number | null;
}

const ModulesDialog = ({ onExamFilter, currentExamFilter }: ModulesDialogProps) => {
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

  // Get available exam numbers from questions with better error handling
  const getAvailableExams = () => {
    if (!questions || questions.length === 0) return [];
    
    const examNumbers = new Set<number>();
    questions.forEach(q => {
      // Check both examNumber and exam properties
      const examNum = q.examNumber || (q as any).exam;
      if (examNum && typeof examNum === 'number' && examNum > 0) {
        examNumbers.add(examNum);
      }
    });
    return Array.from(examNumbers).sort((a, b) => a - b);
  };

  const availableExams = getAvailableExams();
  
  // Debug logging
  useEffect(() => {
    console.log("ModulesDialog - Questions loaded:", questions.length);
    console.log("ModulesDialog - Available exams:", availableExams);
    console.log("ModulesDialog - Current filter:", currentExamFilter);
  }, [questions, availableExams, currentExamFilter]);

  const handleExamClick = (exam: ExamTest) => {
    console.log(`ModulesDialog - Filtering by Exam ${exam.examNumber}...`);
    
    // Check if this exam has questions
    const examQuestions = questions.filter(q => {
      const examNum = q.examNumber || (q as any).exam;
      return examNum === exam.examNumber;
    });
    
    console.log(`ModulesDialog - Found ${examQuestions.length} questions for Exam ${exam.examNumber}`);
    
    if (examQuestions.length === 0) {
      toast({
        title: "No Questions Found",
        description: `No questions found for ${exam.title}. This exam may not be available yet.`,
        variant: "destructive",
      });
      return;
    }

    // Apply exam filter
    if (onExamFilter) {
      console.log(`ModulesDialog - Calling onExamFilter with ${exam.examNumber}`);
      onExamFilter(exam.examNumber);
    } else {
      console.log("ModulesDialog - No onExamFilter callback provided");
    }
    
    setIsOpen(false);
    
    toast({
      title: "Exam Filter Applied",
      description: `Filtered to ${examQuestions.length} questions from ${exam.title}`,
    });
  };

  const handleShowAllExams = () => {
    console.log("ModulesDialog - Clearing exam filter");
    
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
    const count = questions.filter(q => {
      const examNum = q.examNumber || (q as any).exam;
      return examNum === examNumber;
    }).length;
    console.log(`ModulesDialog - Exam ${examNumber} has ${count} questions`);
    return count;
  };

  // Check if exam is currently filtered
  const isExamActive = (examNumber: number) => {
    const active = currentExamFilter === examNumber;
    if (active) {
      console.log(`ModulesDialog - Exam ${examNumber} is currently active`);
    }
    return active;
  };

  // Filter exam tests to only show ones with questions or currently active
  const getVisibleExamTests = () => {
    const visible = examTests.filter(exam => {
      const hasQuestions = getExamQuestionCount(exam.examNumber) > 0;
      const isCurrentlyActive = isExamActive(exam.examNumber);
      return hasQuestions || isCurrentlyActive;
    });
    console.log(`ModulesDialog - Showing ${visible.length} visible exam tests`);
    return visible;
  };

  const visibleExamTests = getVisibleExamTests();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-full bg-transparent transition-colors ${
            isDarkMode ? 'hover:bg-gray-800' : 'hover:
