
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface GoalProps {
  title: string;
  current: number;
  target: number;
  deadline: string;
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
      <Card className="p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="text-lg font-semibold mb-4">Goals</h3>
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{goal.title}</span>
                <span className="text-gray-500">Due: {new Date(goal.deadline).toLocaleDateString()}</span>
              </div>
              <div className="space-y-1">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ originX: 0 }}
                >
                  <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                </motion.div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{goal.current}/{goal.target}</span>
                  <span>{Math.round((goal.current / goal.target) * 100)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};
