
import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";

interface ProjectedScoreProps {
  score?: number;
}

export const ProjectedScore = ({ score = 92 }: ProjectedScoreProps) => {
  return (
    <Card className="p-4 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-500 shadow-emerald-200 shadow-lg p-2 rounded-lg">
          <Target className="h-8 w-8 text-white" fill="white" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Projected Score</p>
          <p className="text-xl font-semibold">{score}%</p>
        </div>
      </div>
    </Card>
  );
};
