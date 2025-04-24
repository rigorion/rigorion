
import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectedScoreProps {
  score?: number;
}

export const ProjectedScore = ({
  score = 92
}: ProjectedScoreProps) => {
  return (
    <Card className="p-4 hover:shadow-xl transition-all duration-300 border-0 overflow-hidden rounded-xl">
      <div className="flex items-center gap-3">
        <motion.div 
          className="bg-white shadow-[0_0_8px_rgba(59,130,246,0.5)] p-2 rounded-lg border-2 relative before:absolute before:inset-0 before:rounded-lg before:opacity-50 before:animate-pulse-subtle"
          style={{
            borderImage: 'linear-gradient(to right, #3b82f6, transparent) 1',
          }}
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
          <Target className="h-6 w-6 text-gray-700" strokeWidth={1.5} />
        </motion.div>
        <div>
          <p className="text-sm text-gray-500">Projected Score</p>
          <p className="text-lg font-semibold">{score}%</p>
        </div>
      </div>
    </Card>
  );
};
