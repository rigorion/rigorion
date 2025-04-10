
import { Calendar, LineChart, Clock, TrendingUp, Award, Target, Star, Trophy } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProgressControlsProps {
  period: string;
  setPeriod: (period: string) => void;
  type: string;
  setType: (type: string) => void;
}

export const ProgressControls = ({ period, setPeriod, type, setType }: ProgressControlsProps) => {
  return (
    <div className="flex gap-4">
      <Select value={period} onValueChange={setPeriod}>
        <SelectTrigger className="w-[160px] rounded-full border border-gray-300 bg-white">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <SelectValue placeholder="Select period" />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-gray-200 shadow-md">
          <SelectItem value="daily" className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-500" />
            Daily
          </SelectItem>
          <SelectItem value="weekly" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            Weekly
          </SelectItem>
          <SelectItem value="monthly" className="flex items-center gap-2">
            <Award className="h-4 w-4 text-purple-500" />
            Monthly
          </SelectItem>
        </SelectContent>
      </Select>

      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-[160px] rounded-full border border-gray-300 bg-white">
          <div className="flex items-center gap-2">
            <LineChart className="h-4 w-4 text-blue-600" />
            <SelectValue placeholder="Select type" />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-gray-200 shadow-md">
          <SelectItem value="progress" className="flex items-center gap-2">
            <Target className="h-4 w-4 text-emerald-500" />
            Progress
          </SelectItem>
          <SelectItem value="performance" className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Performance
          </SelectItem>
          <SelectItem value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-red-500" />
            Leaderboard
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
