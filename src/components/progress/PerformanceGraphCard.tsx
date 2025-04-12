
import { Card } from "@/components/ui/card";
import { ProgressChart } from "./ProgressChart";
import { motion } from "framer-motion";

interface PerformanceDataPoint {
  date: string;
  attempted: number;
}

interface PerformanceGraphCardProps {
  data: PerformanceDataPoint[];
}

export const PerformanceGraphCard = ({ data = [] }: PerformanceGraphCardProps) => {
  return (
    <motion.div 
      variants={{
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
      }}
    >
      <Card className="p-6 hover:shadow-md transition-all duration-300">
        <h3 className="text-lg font-semibold mb-4 text-center">Performance Graph</h3>
        <ProgressChart data={data} />
      </Card>
    </motion.div>
  );
};
