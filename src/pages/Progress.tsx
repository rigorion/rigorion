
import { useState } from "react";
import ProgressDashboard from "@/components/progress/ProgressDashboard";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Trophy,
  Clock,
  BookOpen,
  Target,
  Calendar,
  Star,
  Award,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

const Progress = () => {
  const [period, setPeriod] = useState("weekly");
  const [type, setType] = useState("performance");

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full bg-white shadow-md">
          <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <h1 
                className="text-2xl font-bold text-gray-800"
                style={{ fontFamily: '"Dancing Script", cursive' }}
              >
                Academic Arc
              </h1>
            </div>
            
            {/* Controls */}
            <div className="flex gap-4">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[160px] rounded-full border border-gray-300 bg-white">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <SelectValue placeholder="Select period" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-gray-200 shadow-md">
                  <SelectItem value="daily" className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-500" />
                    Daily
                  </SelectItem>
                  <SelectItem value="weekly" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
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
                    <LineChart className="h-4 w-4 text-blue-500" />
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
          </div>
        </header>

        {/* Stats Overview */}
        <main className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="h-7 w-7 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">Completed Questions</h3>
                  <p className="text-3xl font-bold text-gray-800">248</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-full">
                  <Target className="h-7 w-7 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">Accuracy Rate</h3>
                  <p className="text-3xl font-bold text-gray-800">84%</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Clock className="h-7 w-7 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">Avg. Time/Question</h3>
                  <p className="text-3xl font-bold text-gray-800">1m 24s</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Dashboard */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6">
            <ProgressDashboard 
              period={period} 
              type={type}
              className={cn(
                "[&_path]:stroke-blue-500",
                "[&_.recharts-area]:fill-gradient-to-b [&_.recharts-area]:from-blue-100 [&_.recharts-area]:to-blue-50",
                "[&_.recharts-bar]:fill-gradient-to-b [&_.recharts-bar]:from-blue-400 [&_.recharts-bar]:to-blue-600",
                "[&_.recharts-line]:stroke-blue-500"
              )}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Progress;
