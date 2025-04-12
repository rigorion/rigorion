import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";
import { motion } from "framer-motion";
interface ProjectedScoreProps {
  score?: number;
}
export const ProjectedScore = ({
  score = 92
}: ProjectedScoreProps) => {
  return <Card className="p-4 hover:shadow-xl transition-all duration-300 border-0 overflow-hidden rounded-xl">
      <div className="flex items-center gap-3">
        
        <div>
          <p className="text-sm text-gray-500">Projected Score</p>
          <p className="text-xl font-semibold">{score}%</p>
        </div>
      </div>
    </Card>;
};