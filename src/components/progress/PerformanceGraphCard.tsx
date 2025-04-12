import { Card } from "@/components/ui/card";
import { ProgressChart } from "./ProgressChart";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
interface PerformanceDataPoint {
  date: string;
  attempted: number;
}
interface PerformanceGraphCardProps {
  data: PerformanceDataPoint[];
}
export const PerformanceGraphCard = ({
  data = []
}: PerformanceGraphCardProps) => {
  // Calculate if there's a trend by comparing the last 3 days to the previous 3 days
  const calculateTrend = () => {
    if (data.length < 6) return {
      trend: 0,
      percentage: 0
    };
    const recentDays = data.slice(-3).reduce((sum, item) => sum + item.attempted, 0);
    const previousDays = data.slice(-6, -3).reduce((sum, item) => sum + item.attempted, 0);
    if (previousDays === 0) return {
      trend: 0,
      percentage: 0
    };
    const percentChange = (recentDays - previousDays) / previousDays * 100;
    return {
      trend: Math.sign(percentChange),
      percentage: Math.abs(Math.round(percentChange))
    };
  };
  const trend = calculateTrend();

  // Calculate average questions per day
  const averageQuestions = data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item.attempted, 0) / data.length) : 0;
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
      <Card className="p-6 hover: transition-all duration-300 border-0">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Performance Graph</h3>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-gray-600">
              Avg: {averageQuestions} questions/day
            </div>
            
            {trend.trend !== 0 && <div className={`flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full ${trend.trend > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {trend.trend > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                <span>{trend.percentage}%</span>
              </div>}
          </div>
        </div>
        <ProgressChart data={data} />
      </Card>
    </motion.div>;
};