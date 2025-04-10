
import { Button } from "@/components/ui/button";
import { BookMarked, CheckCircle, Target } from "lucide-react";

interface PracticeTabSelectorProps {
  activeTab: "problem" | "solution" | "quote";
  setActiveTab: (tab: "problem" | "solution" | "quote") => void;
  className?: string;
}

const PracticeTabSelector = ({ activeTab, setActiveTab, className = "" }: PracticeTabSelectorProps) => {
  return (
    <div className={`inline-flex rounded-lg bg-white p-0.5 border ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        className={`px-3 py-0 rounded-md transition-all h-7 ${activeTab === "problem" 
          ? "text-red-500 bg-white shadow-sm shadow-red-100" 
          : "text-gray-500 hover:text-red-400"}`}
        onClick={() => setActiveTab("problem")}
      >
        <Target className="h-3.5 w-3.5 text-gray-400 mr-1" />
        Problem
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`px-3 py-0 rounded-md transition-all h-7 ${activeTab === "solution" 
          ? "text-yellow-500 bg-white shadow-sm shadow-yellow-100" 
          : "text-gray-500 hover:text-yellow-400"}`}
        onClick={() => setActiveTab("solution")}
      >
        <CheckCircle className="h-3.5 w-3.5 text-gray-400 mr-1" />
        Solution
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`px-3 py-0 rounded-md transition-all h-7 ${activeTab === "quote" 
          ? "text-green-500 bg-white shadow-sm shadow-green-100" 
          : "text-gray-500 hover:text-green-400"}`}
        onClick={() => setActiveTab("quote")}
      >
        <BookMarked className="h-3.5 w-3.5 text-gray-400 mr-1" />
        Idea
      </Button>
    </div>
  );
};

export default PracticeTabSelector;
