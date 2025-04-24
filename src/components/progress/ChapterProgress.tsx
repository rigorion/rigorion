
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface ChapterStats {
  chapterId: string;
  chapterName: string;
  correct: number;
  incorrect: number;
  unattempted: number;
}

interface ChapterProgressProps {
  chapters: ChapterStats[];
}

export const ChapterProgress = ({
  chapters = []
}: ChapterProgressProps) => {
  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return value / total * 100;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-6 text-center">Chapter Performance</h3>
      
      <div className="flex justify-center gap-8 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="text-sm text-gray-600">Correct</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
          <span className="text-sm text-gray-600">Incorrect</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          <span className="text-sm text-gray-600">Unattempted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {chapters.map((chapter, index) => {
          const totalQuestions = chapter.correct + chapter.incorrect + chapter.unattempted;
          const correctPercent = calculatePercentage(chapter.correct, totalQuestions);
          const incorrectPercent = calculatePercentage(chapter.incorrect, totalQuestions);
          const unattemptedPercent = calculatePercentage(chapter.unattempted, totalQuestions);
          const coveredQuestions = chapter.correct + chapter.incorrect;
          const totalProgress = calculatePercentage(coveredQuestions, totalQuestions);
          
          return (
            <motion.div
              key={chapter.chapterId || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 bg-white rounded-lg hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-800">{chapter.chapterName}</h4>
                <div className="text-sm">
                  <span className="text-blue-600 font-medium">{coveredQuestions}/{totalQuestions}</span>
                  <span className="text-gray-500 ml-2">({totalProgress.toFixed(0)}%)</span>
                </div>
              </div>
              
              <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden bg-gray-100 relative">
                <motion.div
                  className="bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]"
                  style={{ width: `${correctPercent}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${correctPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <motion.div
                  className="bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]"
                  style={{ width: `${incorrectPercent}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${incorrectPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                />
                <motion.div
                  className="bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]"
                  style={{ width: `${unattemptedPercent}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${unattemptedPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                />
              </div>
              
              <div className="flex justify-between text-xs mt-2">
                <span className="text-emerald-600 font-medium">Correct: {chapter.correct}</span>
                <span className="text-rose-600 font-medium">Incorrect: {chapter.incorrect}</span>
                <span className="text-amber-600 font-medium">Unattempted: {chapter.unattempted}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
