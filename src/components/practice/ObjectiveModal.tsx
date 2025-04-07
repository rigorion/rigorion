import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ObjectiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetObjective: (value: number) => void;
}

const ObjectiveModal = ({ open, onOpenChange, onSetObjective }: ObjectiveModalProps) => {
  const [value, setValue] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Your Practice Objective</DialogTitle>
        </DialogHeader>
        {/* Single input for number of questions */}
        <Input
          type="number"
          placeholder="Number of questions"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          min="1"
          className="rounded-xl"
        />
        <div className="flex justify-end mt-4">
          <Button
            onClick={() => onSetObjective(parseInt(value) || 0)}
            className="rounded-xl transition-all duration-300 hover:bg-blue-50 hover:border-blue-200 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]"
          >
            Set Objective
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ObjectiveModal;
