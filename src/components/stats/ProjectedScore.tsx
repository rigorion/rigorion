
import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";

interface ProjectedScoreProps {
  score?: number;
}

export const ProjectedScore = ({
  score = 92
}: ProjectedScoreProps) => {
  return (
    <Card className="p-4 transition-all duration-300 border-none shadow-none">
      <div className="flex items-center gap-3">
        <Target className="h-6 w-6 text-blue-500" strokeWidth={1.5} />
        <div>
          <p className="text-sm text-gray-500">Projected Score</p>
          <p className="text-lg font-semibold">{score}%</p>
        </div>
      </div>
    </Card>
  );
};
