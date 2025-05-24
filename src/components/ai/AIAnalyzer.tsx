
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, ChevronUp, ChevronDown, Sparkles, TrendingUp, Clock, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AIAnalyzerProps {
  context: "practice" | "progress" | "general";
  data?: any;
}

const AIAnalyzer = ({ context, data }: AIAnalyzerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  const getContextualInsights = () => {
    switch (context) {
      case "practice":
        return {
          title: "Practice Analysis",
          insights: [
            "Focus on geometry problems - 23% accuracy needs improvement",
            "Your response time is 15% faster than average",
            "Consider reviewing algebra fundamentals"
          ]
        };
      case "progress":
        return {
          title: "Progress Analysis", 
          insights: [
            "Strong improvement in medium difficulty questions (+12%)",
            "Consistency in daily practice showing positive trend",
            "Target: Complete 5 more questions to reach weekly goal"
          ]
        };
      default:
        return {
          title: "AI Insights",
          insights: [
            "Ready to provide personalized learning insights",
            "Analyzing your performance patterns",
            "Suggestions for optimal study strategies"
          ]
        };
    }
  };

  const insights = getContextualInsights();

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden max-w-80">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-white border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot className="h-5 w-5 text-gray-400" style={{
                filter: 'drop-shadow(0 0 8px rgba(156, 163, 175, 0.6))',
                animation: 'glow 2s ease-in-out infinite alternate'
              }} />
              <style>
                {`
                @keyframes glow {
                  from {
                    filter: drop-shadow(0 0 8px rgba(156, 163, 175, 0.6));
                  }
                  to {
                    filter: drop-shadow(0 0 12px rgba(156, 163, 175, 0.8));
                  }
                }
                `}
              </style>
            </div>
            <span className="text-sm font-medium text-gray-700">AI Assistant</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0 rounded-full hover:bg-gray-100"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronUp className="h-3 w-3" />
            )}
          </Button>
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-white space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <h3 className="text-sm font-semibold text-gray-800">{insights.title}</h3>
                </div>

                <div className="space-y-2">
                  {insights.insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2 text-xs text-gray-600 p-2 bg-gray-50 rounded"
                    >
                      <div className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                      <span>{insight}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1 h-7 text-xs bg-blue-600 hover:bg-blue-700"
                  >
                    {isAnalyzing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Bot className="h-3 w-3" />
                      </motion.div>
                    ) : (
                      "Analyze"
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs border-gray-200 hover:bg-gray-50"
                  >
                    Tips
                  </Button>
                </div>

                {/* Quick stats for practice context */}
                {context === "practice" && data && (
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Accuracy</div>
                      <div className="text-sm font-medium text-green-600">85%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Speed</div>
                      <div className="text-sm font-medium text-blue-600">Fast</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Streak</div>
                      <div className="text-sm font-medium text-orange-600">7</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed state quick action */}
        {!isExpanded && (
          <div className="p-2 bg-white">
            <Button
              size="sm"
              onClick={handleAnalyze}
              className="w-full h-7 text-xs bg-blue-600 hover:bg-blue-700"
            >
              Quick Analysis
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default AIAnalyzer;
