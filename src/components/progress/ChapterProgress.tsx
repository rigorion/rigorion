
import { Progress } from "@/components/ui/progress";

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

export const ChapterProgress = ({ chapters = [] }: ChapterProgressProps) => {
  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4 text-center">Chapter Performance</h3>
      
      <div className="flex justify-center gap-8 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#4ade80]" />
          <span className="text-sm text-gray-600">Correct</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ea384c]" />
          <span className="text-sm text-gray-600">Incorrect</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#F97316]" />
          <span className="text-sm text-gray-600">Unattempted</span>
        </div>
      </div>

      {chapters.map((chapter, index) => {
        const totalQuestions = chapter.correct + chapter.incorrect + chapter.unattempted;
        const correctPercent = calculatePercentage(chapter.correct, totalQuestions);
        const incorrectPercent = calculatePercentage(chapter.incorrect, totalQuestions);
        const unattemptedPercent = calculatePercentage(chapter.unattempted, totalQuestions);
        const coveredQuestions = chapter.correct + chapter.incorrect;
        const totalProgress = calculatePercentage(coveredQuestions, totalQuestions);

        return (
          <div key={index} className="space-y-2 p-4 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">{chapter.chapterName}</span>
              <span className="text-gray-500">
                {coveredQuestions}/{totalQuestions} ({totalProgress.toFixed(1)}%)
              </span>
            </div>
            
            <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-gray-100">
              <div 
                className="bg-[#4ade80]" 
                style={{ width: `${correctPercent}%` }}
                title={`Correct: ${chapter.correct} (${correctPercent.toFixed(1)}%)`}
              />
              <div 
                className="bg-[#ea384c]" 
                style={{ width: `${incorrectPercent}%` }}
                title={`Incorrect: ${chapter.incorrect} (${incorrectPercent.toFixed(1)}%)`}
              />
              <div 
                className="bg-[#F97316]" 
                style={{ width: `${unattemptedPercent}%` }}
                title={`Unattempted: ${chapter.unattempted} (${unattemptedPercent.toFixed(1)}%)`}
              />
            </div>
            
            <div className="flex gap-4 text-xs text-gray-500">
              <span>{chapter.correct}</span>
              <span>{chapter.incorrect}</span>
              <span>{chapter.unattempted}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
