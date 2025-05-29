
import { Button } from "@/components/ui/button";
import { BookMarked, CheckCircle, Target } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface PracticeTabSelectorProps {
  activeTab: "problem" | "solution" | "quote";
  setActiveTab: (tab: "problem" | "solution" | "quote") => void;
  className?: string;
}

const PracticeTabSelector = ({ activeTab, setActiveTab, className = "" }: PracticeTabSelectorProps) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`inline-flex rounded-lg p-0.5 border ${
      isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
    } ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        className={`px-3 py-0 rounded-md transition-all h-7 ${activeTab === "problem" 
          ? isDarkMode 
            ? "text-green-400 bg-gray-700 shadow-sm" 
            : "text-red-500 bg-white shadow-sm shadow-red-100"
          : isDarkMode
            ? "text-green-500 hover:text-green-400"
            : "text-gray-500 hover:text-red-400"}`}
        onClick={() => setActiveTab("problem")}
      >
        <Target className={`h-3.5 w-3.5 mr-1 ${
          isDarkMode ? 'text-green-400' : 'text-gray-400'
        }`} />
        Problem
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`px-3 py-0 rounded-md transition-all h-7 ${activeTab === "solution" 
          ? isDarkMode 
            ? "text-green-400 bg-gray-700 shadow-sm" 
            : "text-yellow-500 bg-white shadow-sm shadow-yellow-100"
          : isDarkMode
            ? "text-green-500 hover:text-green-400"
            : "text-gray-500 hover:text-yellow-400"}`}
        onClick={() => setActiveTab("solution")}
      >
        <CheckCircle className={`h-3.5 w-3.5 mr-1 ${
          isDarkMode ? 'text-green-400' : 'text-gray-400'
        }`} />
        Solution
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`px-3 py-0 rounded-md transition-all h-7 ${activeTab === "quote" 
          ? isDarkMode 
            ? "text-green-400 bg-gray-700 shadow-sm" 
            : "text-green-500 bg-white shadow-sm shadow-green-100"
          : isDarkMode
            ? "text-green-500 hover:text-green-400"
            : "text-gray-500 hover:text-green-400"}`}
        onClick={() => setActiveTab("quote")}
      >
        <BookMarked className={`h-3.5 w-3.5 mr-1 ${
          isDarkMode ? 'text-green-400' : 'text-gray-400'
        }`} />
        Idea
      </Button>
    </div>
  );
};

export default PracticeTabSelector;
