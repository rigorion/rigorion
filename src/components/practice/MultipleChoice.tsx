
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface MultipleChoiceProps {
  onSelect: (value: string) => void;
  selectedValue: string | null;
  isCorrect: boolean | null;
}

export const MultipleChoice = ({ onSelect, selectedValue, isCorrect }: MultipleChoiceProps) => {
  const choices = [
    { id: "a", text: "Option A" },
    { id: "b", text: "Option B" },
    { id: "c", text: "Option C" },
    { id: "d", text: "Option D" }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {choices.map((choice, index) => (
        <motion.div
          key={choice.id}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full"
          transition={{ duration: 0.2 }}
        >
          <Button
            className={`w-full h-14 text-lg relative rounded-xl border-2 font-medium transition-all duration-300 shadow-sm ${
              selectedValue === choice.id
                ? isCorrect
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400 shadow-green-200/50 shadow-lg"
                  : "bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-400 shadow-red-200/50 shadow-lg"
                : "bg-white text-gray-800 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all border-gray-200"
            }`}
            variant="ghost"
            onClick={() => onSelect(choice.id)}
          >
            {choice.text}
            {selectedValue === choice.id && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute right-4 p-1 rounded-full bg-white/20"
              >
                {isCorrect ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <X className="h-5 w-5 text-white" />
                )}
              </motion.div>
            )}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};
