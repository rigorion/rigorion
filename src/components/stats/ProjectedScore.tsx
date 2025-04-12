
import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectedScoreProps {
  score?: number;
}

export const ProjectedScore = ({ score = 92 }: ProjectedScoreProps) => {
  return (
    <Card className="p-4 hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
      <div className="flex items-center gap-3">
        <motion.div 
          className="bg-emerald-500 shadow-emerald-200 shadow-lg p-2 rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
            repeat: 0
          }}
        >
          <Target className="h-8 w-8 text-white" fill="white" strokeWidth={1.5} />
        </motion.div>
        <div>
          <p className="text-sm text-gray-500">Projected Score</p>
          <p className="text-xl font-semibold">{score}%</p>
        </div>
      </div>
    </Card>
  );
};
