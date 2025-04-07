import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";

export const ProjectedScore = () => {
  return (
    <Card className="p-4 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-full bg-emerald-500 shadow-emerald-200 shadow-lg">
          <Target className="h-5 w-5 text-white" fill="white" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Projected Score</p>
          <p className="text-xl font-semibold">92%</p>
        </div>
      </div>
    </Card>
  );
};