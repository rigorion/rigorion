
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import SegmentedProgress from "@/components/SegmentedProgress";

interface TotalProgressCardProps {
  totalQuestions: number;
  correctQuestions: number;
  incorrectQuestions: number;
  unattemptedQuestions: number;
}

export const TotalProgressCard = ({
  totalQuestions,
  correctQuestions,
  incorrectQuestions,
  unattemptedQuestions
}: TotalProgressCardProps) => {
  const totalProgress = Math.round((correctQuestions + incorrectQuestions) / totalQuestions * 100);
  const correctPercentage = Math.round((correctQuestions / totalQuestions) * 100);
  const incorrectPercentage = Math.round((incorrectQuestions / totalQuestions) * 100);
  const unattemptedPercentage = Math.round((unattemptedQuestions / totalQuestions) * 100);

  return (
    <Card className="p-6 col-span-1 shadow-sm hover:shadow-md transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
      <h3 className="text-lg font-semibold mb-4 text-center">Total Progress</h3>
      <div className="space-y-6">
        <div className="flex justify-center">
          <SegmentedProgress
            progress={totalProgress}
            className="w-60 h-60"
            total={totalQuestions}
            completed={correctQuestions + incorrectQuestions}
          />
        </div>
        <div className="space-y-2">
          <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-gray-100">
            <motion.div
              className="bg-emerald-500"
              style={{ width: `${correctPercentage}%` }}
              title={`Correct: ${correctPercentage}%`}
              initial={{ width: 0 }}
              animate={{ width: `${correctPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <motion.div
              className="bg-rose-500"
              style={{ width: `${incorrectPercentage}%` }}
              title={`Incorrect: ${incorrectPercentage}%`}
              initial={{ width: 0 }}
              animate={{ width: `${incorrectPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            />
            <motion.div
              className="bg-amber-400"
              style={{ width: `${unattemptedPercentage}%` }}
              title={`Unattempted: ${unattemptedPercentage}%`}
              initial={{ width: 0 }}
              animate={{ width: `${unattemptedPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
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
  );
};
