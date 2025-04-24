import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalProps {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  dueDate: string;
}

export const GoalsCard = ({ goals }: { goals: GoalProps[] }) => {
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
        <h3 className="text-lg font-semibold mb-6">Goals</h3>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {goals.map((goal, index) => {
            const progress = (goal.currentValue / goal.targetValue) * 100;
            const isComplete = progress >= 100;
            const dueDate = new Date(goal.dueDate);
            const formattedDate = dueDate.toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            
            return (
              <div key={goal.id || index} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {isComplete ? (
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-amber-500" />
                    )}
                    <span className={cn("font-medium", 
                      isComplete ? "text-emerald-700" : "text-gray-700"
                    )}>{goal.title}</span>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100">Due: {formattedDate}</span>
                </div>
                <div className="space-y-1">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ originX: 0 }}
                  >
                    <Progress 
                      value={Math.min(progress, 100)} 
                      className={cn(
                        "h-1.5", // Thinner bars
                        "bg-gradient-to-r from-blue-900 to-slate-800",
                        "[&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-blue-900"
                      )} 
                    />
                  </motion.div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{goal.currentValue}/{goal.targetValue}</span>
                    <span className={cn(
                      isComplete ? "text-emerald-600 font-medium" : "text-purple-600 font-medium"
                    )}>{Math.round(progress)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};
