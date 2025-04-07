import { Card } from "@/components/ui/card";
import { CircleUserRound, UserCheck, UserRound, UserPlus, Target, Clock, Brain } from 'lucide-react';
import { ProgressChart } from "./ProgressChart";
import { ChapterProgress } from "./ChapterProgress";
import SegmentedProgress from "@/components/SegmentedProgress";
import { Progress } from "@/components/ui/progress";
import { ProjectedScore } from "@/components/stats/ProjectedScore";

interface ProgressDashboardProps {
  period: string;
  type: string;
}

export default function ProgressDashboard({ period, type }: ProgressDashboardProps) {
  const stats = [
    { 
      title: "Speed", 
      value: "85%", 
      icon: CircleUserRound,
      color: "bg-purple-500",
      shadowColor: "shadow-purple-200" 
    },
    { 
      title: "Streak", 
      value: "7 days", 
      icon: UserCheck,
      color: "bg-orange-500",
      shadowColor: "shadow-orange-200"
    },
    { 
      title: "Avg Score", 
      value: "92", 
      icon: UserRound,
      color: "bg-sky-400",
      shadowColor: "shadow-sky-200"
    },
    { 
      title: "Rank", 
      value: "#120", 
      icon: UserPlus,
      color: "bg-blue-500",
      shadowColor: "shadow-blue-200"
    },
    { 
      component: ProjectedScore
    },
  ];

  const difficultyStats = [
    { 
      title: "Easy Questions", 
      correct: 45,
      total: 50,
      avgTime: "1.5 min",
      color: "bg-green-500" 
    },
    { 
      title: "Medium Questions", 
      correct: 35,
      total: 50,
      avgTime: "2.5 min",
      color: "bg-yellow-500" 
    },
    { 
      title: "Hard Questions", 
      correct: 25,
      total: 30,
      avgTime: "4 min",
      color: "bg-red-500" 
    },
  ];

  const timeManagementStats = {
    avgTimePerQuestion: "2.5 min",
    avgTimeCorrect: "2 min",
    avgTimeIncorrect: "3.5 min",
    longestQuestion: "8 min",
  };

  const goals = [
    {
      title: "Complete 100 Questions",
      current: 75,
      target: 100,
      deadline: "2024-05-01",
    },
    {
      title: "Achieve 90% in Hard Questions",
      current: 83,
      target: 90,
      deadline: "2024-05-15",
    },
  ];

  const totalQuestions = 130;
  const correctQuestions = 53;
  const incorrectQuestions = 21;
  const unattemptedQuestions = 56;

  const totalProgress = Math.round((correctQuestions + incorrectQuestions) / totalQuestions * 100);
  const correctPercentage = Math.round((correctQuestions / totalQuestions) * 100);
  const incorrectPercentage = Math.round((incorrectQuestions / totalQuestions) * 100);
  const unattemptedPercentage = Math.round((unattemptedQuestions / totalQuestions) * 100);

  return (
    <div className="space-y-6"> {/* Reduced from space-y-8 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3"> {/* Reduced gap from 4 to 3 */}
        {stats.map((stat, index) => (
          stat.component ? (
            <stat.component key={index} />
          ) : (
            <Card key={index} className="p-4 shadow-lg hover:shadow-xl transition-shadow"> {/* Reduced padding from p-6 to p-4 */}
              <div className="flex items-center gap-3"> {/* Reduced gap from 4 to 3 */}
                <div className={`p-2.5 rounded-lg ${stat.color} ${stat.shadowColor} shadow-lg`}> {/* Reduced padding from p-3 to p-2.5 */}
                  <stat.icon className="h-5 w-5 text-white" fill="white" strokeWidth={1.5} /> {/* Reduced size from h-6 w-6 to h-5 w-5 */}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-xl font-semibold">{stat.value}</p> {/* Reduced from text-2xl */}
                </div>
              </div>
            </Card>
          )
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 col-span-1 shadow-lg hover:shadow-xl transition-shadow shadow-[0_0_15px_rgba(74,222,128,0.2)]">
          <h3 className="text-lg font-semibold mb-4 text-center">Total Progress</h3>
          <div className="space-y-6">
            <div className="flex justify-center">
              <SegmentedProgress 
                progress={totalProgress} 
                className="w-60 h-60" // Increased size
                total={totalQuestions}
                completed={correctQuestions + incorrectQuestions}
              />
            </div>
            <div className="space-y-2">
              <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-gray-100">
                <div 
                  className="bg-[#4ade80]" 
                  style={{ width: `${correctPercentage}%` }}
                  title={`Correct: ${correctPercentage}%`}
                />
                <div 
                  className="bg-[#ea384c]" 
                  style={{ width: `${incorrectPercentage}%` }}
                  title={`Incorrect: ${incorrectPercentage}%`}
                />
                <div 
                  className="bg-[#facc15]" 
                  style={{ width: `${unattemptedPercentage}%` }}
                  title={`Unattempted: ${unattemptedPercentage}%`}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Correct: {correctPercentage}%</span>
                <span>Incorrect: {incorrectPercentage}%</span>
                <span>Unattempted: {unattemptedPercentage}%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold mb-4">Performance Graph</h3>
          <ProgressChart />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {difficultyStats.map((stat, index) => (
          <Card key={index} className="p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold mb-4">{stat.title}</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Accuracy</span>
                  <span>{Math.round((stat.correct / stat.total) * 100)}%</span>
                </div>
                <Progress value={(stat.correct / stat.total) * 100} className={`h-2 ${stat.color}`} />
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Avg Time: {stat.avgTime}</span>
              </div>
              <div className="text-sm text-gray-600">
                {stat.correct}/{stat.total} Completed
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold mb-4">Time Management</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span>Average Time per Question</span>
              </div>
              <span className="font-semibold">{timeManagementStats.avgTimePerQuestion}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-500" />
                <span>Correct Answers Avg Time</span>
              </div>
              <span className="font-semibold">{timeManagementStats.avgTimeCorrect}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-red-500" />
                <span>Incorrect Answers Avg Time</span>
              </div>
              <span className="font-semibold">{timeManagementStats.avgTimeIncorrect}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                <span>Longest Question Time</span>
              </div>
              <span className="font-semibold">{timeManagementStats.longestQuestion}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold mb-4">Goals</h3>
          <div className="space-y-4">
            {goals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{goal.title}</span>
                  <span className="text-gray-500">Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                </div>
                <div className="space-y-1">
                  <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{goal.current}/{goal.target}</span>
                    <span>{Math.round((goal.current / goal.target) * 100)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <ChapterProgress />
        </Card>
      </div>
    </div>
  );
}
