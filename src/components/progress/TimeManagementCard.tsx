
import { Card } from "@/components/ui/card";
import { Clock, Target, Brain, Zap } from "lucide-react";
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
  const items = [
    {
      label: "Average Time per Question",
      value: timeManagementStats.avgTimePerQuestion,
      icon: Clock,
      color: "text-purple-600"
    },
    {
      label: "Correct Answers Avg Time",
      value: timeManagementStats.avgTimeCorrect,
      icon: Target,
      color: "text-emerald-500"
    },
    {
      label: "Incorrect Answers Avg Time",
      value: timeManagementStats.avgTimeIncorrect,
      icon: Brain,
      color: "text-rose-500"
    },
    {
      label: "Longest Question Time",
      value: timeManagementStats.longestQuestion,
      icon: Zap,
      color: "text-amber-500"
    }
  ];

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
      <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300 border-0">
        <h3 className="text-lg font-semibold mb-6">Time Management</h3>
        <div className="space-y-5">
          {items.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gray-100">
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <span className="font-medium text-gray-700">{item.label}</span>
              </div>
              <span className="font-semibold text-gray-900">{item.value}</span>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};
