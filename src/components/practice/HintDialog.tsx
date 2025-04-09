
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Lamp } from "lucide-react";

interface HintDialogProps {
  hint?: string;
  currentQuestionIndex: number;
}

const HintDialog = ({ hint = "Try breaking down the problem into smaller parts.", currentQuestionIndex }: HintDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hintsUsed, setHintsUsed] = useState<number[]>([]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && !hintsUsed.includes(currentQuestionIndex)) {
      setHintsUsed([...hintsUsed, currentQuestionIndex]);
    }
  };

  // Glowing effect for the lamp icon
  const isHintUsed = hintsUsed.includes(currentQuestionIndex);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-full transition-all duration-300 ${
            !isHintUsed ? 'hint-glow' : ''
          }`}
        >
          <Lamp className={`h-4 w-4 ${isHintUsed ? 'text-amber-500' : 'text-blue-500'}`} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-center">Hint</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-800">{hint}</p>
          </div>
          
          {isHintUsed && (
            <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>You've viewed this hint before</span>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline" className="w-full">
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
      
      <style jsx>{`
        @keyframes glow {
          0% {
            box-shadow: 0 0 5px 2px rgba(249, 215, 28, 0.2);
          }
          50% {
            box-shadow: 0 0 8px 4px rgba(249, 215, 28, 0.4);
          }
          100% {
            box-shadow: 0 0 5px 2px rgba(249, 215, 28, 0.2);
          }
        }
        
        .hint-glow {
          animation: glow 10s infinite ease-in-out;
        }
      `}</style>
    </Dialog>
  );
};

export default HintDialog;
