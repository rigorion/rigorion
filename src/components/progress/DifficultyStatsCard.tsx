import { Card } from "@/components/ui/card";
import { Clock, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
interface DifficultyStatProps {
  title: string;
  correct: number;
  total: number;
  avgTime: string;
  color: string;
}
export const DifficultyStatCard = ({
  stat
}: {
  stat: DifficultyStatProps;
}) => {
  const {
    title,
    correct,
    total,
    avgTime,
    color
  } = stat;
  const accuracy = Math.round(correct / total * 100);
  return <motion.div variants={{
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }}>
      <Card className="p-2 shadow-md hover:shadow-lg transition-all duration-300 border-0 py-0">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Accuracy</span>
              <span className="font-medium">{accuracy}%</span>
            </div>
            <motion.div initial={{
            scaleX: 0
          }} animate={{
            scaleX: 1
          }} transition={{
            duration: 1,
            ease: "easeOut"
          }} style={{
            originX: 0
          }}>
              <Progress value={correct / total * 100} className={`h-2 bg-gray-100 [&>div]:${color}`} />
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg py-[7px]">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Avg Time</p>
                <p className="font-medium">{avgTime}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Completed</p>
                <p className="font-medium">{correct}/{total}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>;
};
export const DifficultyStatsGrid = ({
  stats
}: {
  stats: DifficultyStatProps[];
}) => {
  return <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={{
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  }} initial="hidden" animate="visible">
      {stats.map((stat, index) => <DifficultyStatCard key={index} stat={stat} />)}
    </motion.div>;
};