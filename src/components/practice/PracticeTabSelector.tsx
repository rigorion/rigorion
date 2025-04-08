
import { Button } from "@/components/ui/button";
import { BookMarked, CheckCircle, Target } from "lucide-react";

interface PracticeTabSelectorProps {
  activeTab: "problem" | "solution" | "quote";
  setActiveTab: (tab: "problem" | "solution" | "quote") => void;
}

const PracticeTabSelector = ({ activeTab, setActiveTab }: PracticeTabSelectorProps) => {
  return (
    <div className="">
      <div className="flex justify-center px-6 py-2">
        <div className="inline-flex rounded-lg bg-white p-1 border">
          <Button
            variant="ghost"
            className={`px-8 rounded-full transition-all ${activeTab === "problem" 
              ? "text-red-500 bg-white shadow-md shadow-red-100" 
              : "text-gray-500 hover:text-red-400"}`}
            onClick={() => setActiveTab("problem")}
          >
            <Target className="h-4 w-4 text-gray-400 mr-2" />
            Problem
          </Button>
          <Button
            variant="ghost"
            className={`px-8 rounded-full transition-all ${activeTab === "solution" 
              ? "text-yellow-500 bg-white shadow-md shadow-yellow-100" 
              : "text-gray-500 hover:text-yellow-400"}`}
            onClick={() => setActiveTab("solution")}
          >
            <CheckCircle className="h-4 w-4 text-gray-400 mr-2" />
            Solution
          </Button>
          <Button
            variant="ghost"
            className={`px-8 rounded-full transition-all ${activeTab === "quote" 
              ? "text-green-500 bg-white shadow-md shadow-green-100" 
              : "text-gray-500 hover:text-green-400"}`}
            onClick={() => setActiveTab("quote")}
          >
            <BookMarked className="h-4 w-4 text-gray-400 mr-2" />
            Idea
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PracticeTabSelector;
