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

  const handleSetObjective = () => {
    if (objectiveType === "questions") {
      onSetObjective("questions", questionCount);
    } else {
      onSetObjective("time", timeInMinutes * 60); // Convert to seconds
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
                value={questionCount}
                onChange={(e) => setQuestionCount(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="w-full rounded-xl"
              />
            </TabsContent>
            
            <TabsContent value="time" className="mt-4">
              <Input
                type="number"
                placeholder="Minutes"
                value={timeInMinutes}
                onChange={(e) => setTimeInMinutes(Math.max(1, parseInt(e.target.value) || 1))}
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
