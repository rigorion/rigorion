
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
    <div className={`flex justify-center w-full ${className}`}>
      <div className={`inline-flex rounded-full p-1 border ${
        isDarkMode ? 'bg-gray-900 border-green-500/30' : 'bg-white border-gray-200'
      }`}>
        <Button
          variant="ghost"
          size="sm"
          className={`px-4 py-2 rounded-full transition-all h-8 ${activeTab === "problem" 
            ? isDarkMode 
              ? "text-green-400 bg-gray-800 shadow-sm border border-green-500/30" 
              : "text-red-500 bg-white shadow-sm shadow-red-100"
            : isDarkMode
              ? "text-green-400 hover:text-green-300 hover:bg-gray-800"
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
          className={`px-4 py-2 rounded-full transition-all h-8 ${activeTab === "solution" 
            ? isDarkMode 
              ? "text-green-400 bg-gray-800 shadow-sm border border-green-500/30" 
              : "text-yellow-500 bg-white shadow-sm shadow-yellow-100"
            : isDarkMode
              ? "text-green-400 hover:text-green-300 hover:bg-gray-800"
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
          className={`px-4 py-2 rounded-full transition-all h-8 ${activeTab === "quote" 
            ? isDarkMode 
              ? "text-green-400 bg-gray-800 shadow-sm border border-green-500/30" 
              : "text-green-500 bg-white shadow-sm shadow-green-100"
            : isDarkMode
              ? "text-green-400 hover:text-green-300 hover:bg-gray-800"
              : "text-gray-500 hover:text-green-400"}`}
          onClick={() => setActiveTab("quote")}
        >
          <BookMarked className={`h-3.5 w-3.5 mr-1 ${
            isDarkMode ? 'text-green-400' : 'text-gray-400'
          }`} />
          Idea
        </Button>
      </div>
    </div>
  );
};

export default PracticeTabSelector;
