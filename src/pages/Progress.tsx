
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
  TrendingUp,
  Home,
  GraduationCap,
  BrainCircuit,
  Info,
  Navigation,
  ChevronRight,
  Zap // Energy icon replacement
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sidebar } from "@/components/practice/Sidebar";
import { AnimatePresence } from "framer-motion";

const Progress = () => {
  const [period, setPeriod] = useState("weekly");
  const [type, setType] = useState("performance");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Animated Sidebar */}
      <AnimatePresence>
        {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
      </AnimatePresence>
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full bg-white shadow-md">
          <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-6">
            <div className="flex items-center gap-3">
              {/* Collapsible Sidebar Trigger */}
              <Collapsible open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <CollapsibleTrigger className="rounded-lg p-2 hover:bg-gray-100 transition-colors">
                  <Navigation className="h-5 w-5 text-blue-500" />
                </CollapsibleTrigger>
              </Collapsible>
              
              <h1 
                className="text-2xl font-bold text-gray-800"
                style={{ fontFamily: '"Dancing Script", cursive' }}
              >
                Academic Arc
              </h1>
              
              {/* Navigation Menu */}
              <NavigationMenu className="ml-6">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      className={navigationMenuTriggerStyle()}
                      onClick={() => navigate("/")}
                    >
                      <Home className="w-4 h-4 mr-2 text-blue-600" />
                      Home
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      className={navigationMenuTriggerStyle()}
                      onClick={() => navigate("/exams")}
                    >
                      <GraduationCap className="w-4 h-4 mr-2 text-blue-600" />
                      Exams
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      className={navigationMenuTriggerStyle()}
                      onClick={() => navigate("/practice")}
                    >
                      <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                      Practice
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-blue-50">
                      <BrainCircuit className="w-4 h-4 mr-2 text-blue-600" />
                      Progress
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-50 to-blue-100 p-6 no-underline outline-none focus:shadow-md"
                            >
                              <div className="mb-2 mt-4 text-lg font-medium">
                                Track Your Progress
                              </div>
                              <p className="text-sm leading-tight text-blue-600/90">
                                View detailed statistics about your performance and track your improvement over time.
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li onClick={() => setPeriod("daily")}>
                          <NavigationMenuLink asChild>
                            <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600">
                              <div className="text-sm font-medium leading-none">Daily Stats</div>
                              <p className="line-clamp-2 text-sm leading-snug text-blue-600/90">
                                View your performance for today
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li onClick={() => setType("leaderboard")}>
                          <NavigationMenuLink asChild>
                            <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600">
                              <div className="text-sm font-medium leading-none">Leaderboard</div>
                              <p className="line-clamp-2 text-sm leading-snug text-blue-600/90">
                                See how you rank among other students
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      className={navigationMenuTriggerStyle()}
                      onClick={() => navigate("/about")}
                    >
                      <Info className="w-4 h-4 mr-2 text-blue-600" />
                      About Us
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            
            {/* Controls */}
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
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-10">
          {type === "leaderboard" ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 overflow-hidden">
              <h2 className="text-2xl font-bold mb-6 text-blue-800">Leaderboard</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-blue-800">Rank</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-blue-800">User</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-blue-800">Problems</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-blue-800">Accuracy</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-blue-800">Projected Score</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-blue-800">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { rank: 1, name: "Alex Zhang", problems: 456, accuracy: "94%", score: 98, trend: +3 },
                      { rank: 2, name: "Maria Rodriguez", problems: 421, accuracy: "92%", score: 96, trend: 0 },
                      { rank: 3, name: "David Kim", problems: 398, accuracy: "91%", score: 95, trend: +1 },
                      { rank: 4, name: "Jessica Taylor", problems: 387, accuracy: "89%", score: 93, trend: -2 },
                      { rank: 5, name: "Raj Patel", problems: 365, accuracy: "88%", score: 91, trend: +5 },
                      { rank: 6, name: "Sophie Chen", problems: 342, accuracy: "87%", score: 90, trend: -1 },
                      { rank: 7, name: "James Wilson", problems: 321, accuracy: "85%", score: 89, trend: 0 },
                      { rank: 8, name: "Emma Johnson", problems: 310, accuracy: "84%", score: 88, trend: +2 },
                      { rank: 9, name: "Michael Brown", problems: 298, accuracy: "82%", score: 86, trend: -3 },
                      { rank: 10, name: "Current User", problems: 248, accuracy: "84%", score: 92, isCurrentUser: true, trend: +4 },
                    ].map((user, index) => (
                      <tr 
                        key={index} 
                        className={`transition-colors hover:bg-blue-50/50 ${
                          user.isCurrentUser ? "bg-blue-100/50 font-medium" : ""
                        }`}
                      >
                        <td className="border-t px-4 py-3">
                          <div className="flex items-center">
                            <span className={`font-bold ${
                              user.rank === 1 ? "text-amber-500" :
                              user.rank === 2 ? "text-gray-500" :
                              user.rank === 3 ? "text-amber-700" : ""
                            }`}>
                              {user.rank}
                            </span>
                            {user.rank <= 3 && (
                              <Trophy className={`ml-2 h-4 w-4 ${
                                user.rank === 1 ? "text-amber-500 fill-amber-500" :
                                user.rank === 2 ? "text-gray-500 fill-gray-500" :
                                user.rank === 3 ? "text-amber-700 fill-amber-700" : ""
                              }`} />
                            )}
                          </div>
                        </td>
                        <td className="border-t px-4 py-3">{user.name}</td>
                        <td className="border-t px-4 py-3">{user.problems}</td>
                        <td className="border-t px-4 py-3">{user.accuracy}</td>
                        <td className="border-t px-4 py-3">
                          <div className="flex items-center">
                            {user.score}
                            {user.rank <= 3 && (
                              <Star className="ml-2 h-4 w-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                        </td>
                        <td className="border-t px-4 py-3">
                          <div className={`flex items-center ${
                            user.trend > 0 ? "text-emerald-500" : 
                            user.trend < 0 ? "text-rose-500" : "text-gray-500"
                          }`}>
                            {user.trend > 0 && "+"}
                            {user.trend}%
                            {user.trend !== 0 && (
                              <ChevronRight 
                                className={`h-4 w-4 ml-1 ${
                                  user.trend > 0 ? "rotate-90" : "rotate-270"
                                }`}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <ProgressDashboard 
              period={period} 
              type={type}
              className={cn(
                "[&_path]:stroke-blue-600",
                "[&_.recharts-area]:fill-gradient-to-b [&_.recharts-area]:from-blue-100 [&_.recharts-area]:to-blue-50",
                "[&_.recharts-bar]:fill-gradient-to-b [&_.recharts-bar]:from-blue-400 [&_.recharts-bar]:to-blue-600",
                "[&_.recharts-line]:stroke-blue-600"
              )}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Progress;
