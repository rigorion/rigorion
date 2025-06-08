import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";

interface ObjectiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetObjective: (type: "questions" | "time", value: number) => void;
}

const ObjectiveDialog = ({ open, onOpenChange, onSetObjective }: ObjectiveDialogProps) => {
  const [objectiveType, setObjectiveType] = useState<"questions" | "time">("questions");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timeInMinutes, setTimeInMinutes] = useState<number>(30);
  const [questionCountInput, setQuestionCountInput] = useState<string>("10");
  const [timeInput, setTimeInput] = useState<string>("30");

  const handleQuestionCountChange = (value: string) => {
    setQuestionCountInput(value);
    const parsed = parseInt(value);
    if (!isNaN(parsed) && parsed > 0) {
      setQuestionCount(parsed);
    }
  };

  const handleQuestionCountBlur = () => {
    const parsed = parseInt(questionCountInput);
    const finalValue = isNaN(parsed) || parsed < 1 ? 1 : parsed;
    setQuestionCount(finalValue);
    setQuestionCountInput(finalValue.toString());
  };

  const handleTimeChange = (value: string) => {
    setTimeInput(value);
    const parsed = parseInt(value);
    if (!isNaN(parsed) && parsed > 0) {
      setTimeInMinutes(parsed);
    }
  };

  const handleTimeBlur = () => {
    const parsed = parseInt(timeInput);
    const finalValue = isNaN(parsed) || parsed < 1 ? 1 : parsed;
    setTimeInMinutes(finalValue);
    setTimeInput(finalValue.toString());
  };

  const handleSetObjective = () => {
    // Ensure final validation before setting objective
    handleQuestionCountBlur();
    handleTimeBlur();
    
    if (objectiveType === "questions") {
      const finalQuestionCount = Math.max(1, parseInt(questionCountInput) || 1);
      onSetObjective("questions", finalQuestionCount);
    } else {
      const finalTimeInMinutes = Math.max(1, parseInt(timeInput) || 1);
      onSetObjective("time", finalTimeInMinutes * 60); // Convert to seconds
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-xl bg-white">
        <div className="p-6">
          <div className="flex justify-between items-center mb-3">
            <DialogTitle className="text-xl font-medium">Set Your Practice Objective</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full h-8 w-8">
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <Tabs defaultValue="questions" onValueChange={(value) => setObjectiveType(value as "questions" | "time")} className="mb-6">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
              <TabsTrigger value="questions" className="rounded-md">Questions</TabsTrigger>
              <TabsTrigger value="time" className="rounded-md">Time</TabsTrigger>
            </TabsList>
            
            <TabsContent value="questions" className="mt-4">
              <Input
                type="number"
                placeholder="Number of questions"
                value={questionCountInput}
                onChange={(e) => handleQuestionCountChange(e.target.value)}
                onBlur={handleQuestionCountBlur}
                min="1"
                className="w-full rounded-xl"
              />
            </TabsContent>
            
            <TabsContent value="time" className="mt-4">
              <Input
                type="number"
                placeholder="Minutes"
                value={timeInput}
                onChange={(e) => handleTimeChange(e.target.value)}
                onBlur={handleTimeBlur}
                min="1"
                className="w-full rounded-xl"
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button 
              onClick={handleSetObjective}
              className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl px-16 py-2"
            >
              Set Objective
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ObjectiveDialog;
