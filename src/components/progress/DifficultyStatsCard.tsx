
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface DifficultyStatProps {
  title: string;
  correct: number;
  total: number;
  avgTime: string;
  color: string;
}

export const DifficultyStatCard = ({ stat }: { stat: DifficultyStatProps }) => {
  const { title, correct, total, avgTime, color } = stat;

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
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Accuracy</span>
              <span>{Math.round((correct / total) * 100)}%</span>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ originX: 0 }}
            >
              <Progress value={(correct / total) * 100} className={`h-2 ${color}`} />
            </motion.div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Avg Time: {avgTime}</span>
          </div>
          <div className="text-sm text-gray-600">
            {correct}/{total} Completed
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export const DifficultyStatsGrid = ({ stats }: { stats: DifficultyStatProps[] }) => {
  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            when: "beforeChildren",
            staggerChildren: 0.1
          }
        }
      }}
    >
      {stats.map((stat, index) => (
        <DifficultyStatCard key={index} stat={stat} />
      ))}
    </motion.div>
  );
};
