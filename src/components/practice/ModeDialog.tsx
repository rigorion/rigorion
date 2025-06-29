
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timer, Layers, Hand, Clock, FileText, X } from "lucide-react";

interface ModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetMode: (mode: "timer" | "level" | "manual" | "pomodoro" | "exam", duration?: number, level?: "easy" | "medium" | "hard") => void;
}

const ModeDialog = ({ open, onOpenChange, onSetMode }: ModeDialogProps) => {
  const [selectedMode, setSelectedMode] = useState<"timer" | "level" | "manual" | "pomodoro" | "exam">("timer");
  const [timerDuration, setTimerDuration] = useState(30); // Default minutes
  const [selectedLevel, setSelectedLevel] = useState<"easy" | "medium" | "hard">("easy");

  const handleSetMode = () => {
    let finalDuration: number | undefined;
    
    switch(selectedMode) {
      case "timer":
        finalDuration = timerDuration * 60; // Convert to seconds
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
    
    onSetMode(selectedMode, finalDuration, selectedMode === "level" ? selectedLevel : undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-xl bg-white">
        <div className="p-6">
          <div className="flex justify-between items-center mb-3">
            <DialogTitle className="text-xl font-medium">Select Practice Mode</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full h-8 w-8">
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="mb-6">
            <Tabs defaultValue={selectedMode} className="w-full" onValueChange={(value) => setSelectedMode(value as any)}>
              <TabsList className="flex w-full bg-gray-100 rounded-lg p-1">
                <TabsTrigger 
                  value="timer" 
                  className="flex-1 rounded-md data-[state=active]:bg-white"
                >
                  <Timer className="h-4 w-4 mr-1" />
                  Timer
                </TabsTrigger>
                <TabsTrigger 
                  value="level" 
                  className="flex-1 rounded-md data-[state=active]:bg-white"
                >
                  <Layers className="h-4 w-4 mr-1" />
                  Level
                </TabsTrigger>
                <TabsTrigger 
                  value="manual" 
                  className="flex-1 rounded-md data-[state=active]:bg-white"
                >
                  <Hand className="h-4 w-4 mr-1" />
                  Manual
                </TabsTrigger>
                <TabsTrigger 
                  value="pomodoro" 
                  className="flex-1 rounded-md data-[state=active]:bg-white"
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Pomodoro
                </TabsTrigger>
                <TabsTrigger 
                  value="exam" 
                  className="flex-1 rounded-md data-[state=active]:bg-white"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Exam
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="mb-6">
            {selectedMode === "timer" && (
              <div>
                <Label className="mb-2 block">Set Timer (Minutes)</Label>
                <Input
                  type="number"
                  placeholder="Minutes"
                  value={timerDuration}
                  onChange={(e) => setTimerDuration(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-full rounded-xl"
                />
                <p className="text-sm text-gray-500 mt-2">Auto-advances to next question when timer expires</p>
              </div>
            )}

            {selectedMode === "level" && (
              <div>
                <Label className="mb-3 block">Select Difficulty Level</Label>
                <RadioGroup 
                  value={selectedLevel} 
                  onValueChange={(value) => setSelectedLevel(value as "easy" | "medium" | "hard")}
                  className="flex flex-col space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="easy" id="easy" />
                    <Label htmlFor="easy">Easy - Beginner level questions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium - Intermediate level questions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hard" id="hard" />
                    <Label htmlFor="hard">Hard - Advanced level questions</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {selectedMode === "pomodoro" && (
              <div>
                <Label className="mb-2 block">Pomodoro Session</Label>
                <p className="text-sm text-gray-600">25-minute focused study sessions with 5-minute breaks</p>
              </div>
            )}

            {selectedMode === "exam" && (
              <div>
                <Label className="mb-2 block">Exam Mode</Label>
                <p className="text-sm text-gray-600">1-hour timed practice session</p>
              </div>
            )}

            {selectedMode === "manual" && (
              <div>
                <Label className="mb-2 block">Manual Mode</Label>
                <p className="text-sm text-gray-600">Navigate questions at your own pace</p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSetMode}
              className="bg-emerald-400 hover:bg-emerald-500 text-black rounded-xl px-16 py-2"
            >
              Set Mode
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModeDialog;
