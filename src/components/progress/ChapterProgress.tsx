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
  return <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-6 text-center">Chapter Performance</h3>
      
      <div className="flex justify-center gap-8 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-gray-600">Correct</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <span className="text-sm text-gray-600">Incorrect</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-sm text-gray-600">Unattempted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {chapters.map((chapter, index) => {
        const totalQuestions = chapter.correct + chapter.incorrect + chapter.unattempted;
        const correctPercent = calculatePercentage(chapter.correct, totalQuestions);
        const incorrectPercent = calculatePercentage(chapter.incorrect, totalQuestions);
        const unattemptedPercent = calculatePercentage(chapter.unattempted, totalQuestions);
        const coveredQuestions = chapter.correct + chapter.incorrect;
        const totalProgress = calculatePercentage(coveredQuestions, totalQuestions);
        return <motion.div key={chapter.chapterId || index} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.3,
          delay: index * 0.1
        }} className="space-y-3 p-0 hover:shadow-lg transition-all duration-300 bg-white rounded-none">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-800">{chapter.chapterName}</h4>
                <span className="text-sm text-gray-500 font-medium">
                  {coveredQuestions}/{totalQuestions} ({totalProgress.toFixed(0)}%)
                </span>
              </div>
              
              <div className="flex gap-1 h-2.5 rounded-full overflow-hidden bg-gray-100">
                <motion.div className="bg-emerald-500" style={{
              width: `${correctPercent}%`
            }} title={`Correct: ${chapter.correct} (${correctPercent.toFixed(1)}%)`} initial={{
              width: 0
            }} animate={{
              width: `${correctPercent}%`
            }} transition={{
              duration: 1,
              ease: "easeOut"
            }} />
                <motion.div className="bg-rose-500" style={{
              width: `${incorrectPercent}%`
            }} title={`Incorrect: ${chapter.incorrect} (${incorrectPercent.toFixed(1)}%)`} initial={{
              width: 0
            }} animate={{
              width: `${incorrectPercent}%`
            }} transition={{
              duration: 1,
              ease: "easeOut",
              delay: 0.2
            }} />
                <motion.div className="bg-amber-500" style={{
              width: `${unattemptedPercent}%`
            }} title={`Unattempted: ${chapter.unattempted} (${unattemptedPercent.toFixed(1)}%)`} initial={{
              width: 0
            }} animate={{
              width: `${unattemptedPercent}%`
            }} transition={{
              duration: 1,
              ease: "easeOut",
              delay: 0.4
            }} />
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>Correct: {chapter.correct}</span>
                <span>Incorrect: {chapter.incorrect}</span>
                <span>Unattempted: {chapter.unattempted}</span>
              </div>
            </motion.div>;
      })}
      </div>
    </div>;
};