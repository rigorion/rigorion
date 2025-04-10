
import { Card } from "@/components/ui/card";
import { Clock, Target, Brain } from "lucide-react";
import { motion } from "framer-motion";

interface TimeManagementProps {
  avgTimePerQuestion: string;
  avgTimeCorrect: string;
  avgTimeIncorrect: string;
  longestQuestion: string;
}

export const TimeManagementCard = ({ 
  timeManagementStats 
}: { 
  timeManagementStats: TimeManagementProps 
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: "easeOut"
          }
        }
      }}
    >
      <Card className="p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="text-lg font-semibold mb-4">Time Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Average Time per Question</span>
            </div>
            <span className="font-semibold">{timeManagementStats.avgTimePerQuestion}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-500" />
              <span>Correct Answers Avg Time</span>
            </div>
            <span className="font-semibold">{timeManagementStats.avgTimeCorrect}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-rose-500" />
              <span>Incorrect Answers Avg Time</span>
            </div>
            <span className="font-semibold">{timeManagementStats.avgTimeIncorrect}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <span>Longest Question Time</span>
            </div>
            <span className="font-semibold">{timeManagementStats.longestQuestion}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
