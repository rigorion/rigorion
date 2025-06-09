
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timer, Layers, Hand, Clock, FileText, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

interface ModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetMode: (mode: "timer" | "level" | "manual" | "pomodoro" | "exam", duration?: number, level?: "easy" | "medium" | "hard", examNumber?: number) => void;
}

const ModeDialog = ({ open, onOpenChange, onSetMode }: ModeDialogProps) => {
  const { isDarkMode } = useTheme();
  const [selectedMode, setSelectedMode] = useState<"timer" | "level" | "manual" | "pomodoro" | "exam">("timer");
  const [timerDuration, setTimerDuration] = useState(2); // Default 2 minutes per question
  const [selectedLevel, setSelectedLevel] = useState<"easy" | "medium" | "hard">("easy");
  const [selectedExam, setSelectedExam] = useState<number>(1);

  const handleSetMode = () => {
    let finalDuration: number | undefined;
    
    switch(selectedMode) {
      case "timer":
        finalDuration = timerDuration * 60; // Convert to seconds (per question)
        break;
      case "pomodoro":
        finalDuration = 1500; // 25 minutes in seconds
        break;
      case "exam":
        finalDuration = 3600; // 1 hour in seconds
        break;
      default:
        finalDuration = undefined;
    }
    
    onSetMode(
      selectedMode, 
      finalDuration, 
      selectedMode === "level" ? selectedLevel : undefined,
      selectedMode === "exam" ? selectedExam : undefined
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-2xl p-0 overflow-hidden rounded-2xl border-0 shadow-2xl ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <DialogTitle className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Choose Your Practice Mode
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)} 
              className={`rounded-full h-10 w-10 transition-all duration-200 hover:scale-110 ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mb-8">
            <Tabs 
              defaultValue={selectedMode} 
              className="w-full" 
              onValueChange={(value) => setSelectedMode(value as any)}
            >
              <TabsList className={`grid grid-cols-5 w-full p-1 rounded-xl ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <TabsTrigger 
                  value="timer" 
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all duration-200 ${
                    isDarkMode 
                      ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-white' 
                      : 'data-[state=active]:bg-white data-[state=active]:shadow-md'
                  }`}
                >
                  <Timer className="h-5 w-5" />
                  <span className="text-xs font-medium">Timer</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="level" 
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all duration-200 ${
                    isDarkMode 
                      ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-white' 
                      : 'data-[state=active]:bg-white data-[state=active]:shadow-md'
                  }`}
                >
                  <Layers className="h-5 w-5" />
                  <span className="text-xs font-medium">Level</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="manual" 
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all duration-200 ${
                    isDarkMode 
                      ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-white' 
                      : 'data-[state=active]:bg-white data-[state=active]:shadow-md'
                  }`}
                >
                  <Hand className="h-5 w-5" />
                  <span className="text-xs font-medium">Manual</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="pomodoro" 
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all duration-200 ${
                    isDarkMode 
                      ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-white' 
                      : 'data-[state=active]:bg-white data-[state=active]:shadow-md'
                  }`}
                >
                  <Clock className="h-5 w-5" />
                  <span className="text-xs font-medium">Pomodoro</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="exam" 
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all duration-200 ${
                    isDarkMode 
                      ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-white' 
                      : 'data-[state=active]:bg-white data-[state=active]:shadow-md'
                  }`}
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-xs font-medium">Exam</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="mb-8"
            >
              {selectedMode === "timer" && (
                <div className={`p-6 rounded-xl ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Timer className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <h3 className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Timer Mode</h3>
                  </div>
                  <Label className={`mb-3 block text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Minutes per question
                  </Label>
                  <Input
                    type="number"
                    placeholder="Minutes"
                    value={timerDuration}
                    onChange={(e) => setTimerDuration(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max="60"
                    className={`w-full rounded-lg border-0 text-lg font-medium ${
                      isDarkMode 
                        ? 'bg-gray-700 text-white placeholder-gray-400' 
                        : 'bg-white text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <p className={`text-sm mt-3 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    ⏱️ Auto-advances to next question when timer expires
                  </p>
                </div>
              )}

              {selectedMode === "level" && (
                <div className={`p-6 rounded-xl ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Layers className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    <h3 className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Level Mode</h3>
                  </div>
                  <Label className={`mb-4 block text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Select Difficulty Level
                  </Label>
                  <RadioGroup 
                    value={selectedLevel} 
                    onValueChange={(value) => setSelectedLevel(value as "easy" | "medium" | "hard")}
                    className="grid grid-cols-3 gap-3"
                  >
                    <div className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedLevel === "easy" 
                        ? (isDarkMode ? 'border-green-500 bg-green-500/10' : 'border-green-500 bg-green-50')
                        : (isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white')
                    }`}>
                      <RadioGroupItem value="easy" id="easy" className="sr-only" />
                      <Label htmlFor="easy" className="cursor-pointer block">
                        <div className="text-center">
                          <div className="text-2xl mb-2">🟢</div>
                          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Easy</div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Beginner</div>
                        </div>
                      </Label>
                    </div>
                    <div className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedLevel === "medium" 
                        ? (isDarkMode ? 'border-yellow-500 bg-yellow-500/10' : 'border-yellow-500 bg-yellow-50')
                        : (isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white')
                    }`}>
                      <RadioGroupItem value="medium" id="medium" className="sr-only" />
                      <Label htmlFor="medium" className="cursor-pointer block">
                        <div className="text-center">
                          <div className="text-2xl mb-2">🟡</div>
                          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Medium</div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Intermediate</div>
                        </div>
                      </Label>
                    </div>
                    <div className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedLevel === "hard" 
                        ? (isDarkMode ? 'border-red-500 bg-red-500/10' : 'border-red-500 bg-red-50')
                        : (isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white')
                    }`}>
                      <RadioGroupItem value="hard" id="hard" className="sr-only" />
                      <Label htmlFor="hard" className="cursor-pointer block">
                        <div className="text-center">
                          <div className="text-2xl mb-2">🔴</div>
                          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Hard</div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Advanced</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {selectedMode === "pomodoro" && (
                <div className={`p-6 rounded-xl ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className={`h-6 w-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                    <h3 className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Pomodoro Technique</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        25 minutes of focused study
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        5 minutes break with helpful tips
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        No auto-advance between questions
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {selectedMode === "exam" && (
                <div className={`p-6 rounded-xl ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className={`h-6 w-6 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                    <h3 className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Exam Mode</h3>
                  </div>
                  <Label className={`mb-3 block text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Select Practice Exam
                  </Label>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((examNum) => (
                      <button
                        key={examNum}
                        onClick={() => setSelectedExam(examNum)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedExam === examNum
                            ? (isDarkMode ? 'border-orange-500 bg-orange-500/10 text-orange-400' : 'border-orange-500 bg-orange-50 text-orange-600')
                            : (isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300')
                        }`}
                      >
                        <div className="text-sm font-medium">Exam {examNum}</div>
                      </button>
                    ))}
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    🕐 60 minutes • Full exam simulation
                  </p>
                </div>
              )}

              {selectedMode === "manual" && (
                <div className={`p-6 rounded-xl ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Hand className={`h-6 w-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <h3 className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Manual Mode</h3>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    🎯 Navigate questions at your own pace with full control
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSetMode}
              className={`rounded-xl px-8 py-3 text-white font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              }`}
            >
              Start Session
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ModeDialog;
