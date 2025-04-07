import { Progress } from "@/components/ui/progress";

interface ChapterStats {
  name: string;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  unattempted: number;
}

export const ChapterProgress = () => {
  const chapters: ChapterStats[] = [
    { 
      name: "Chapter 1", 
      totalQuestions: 20,
      correct: 12,
      incorrect: 3,
      unattempted: 5
    },
    { 
      name: "Chapter 2", 
      totalQuestions: 15,
      correct: 8,
      incorrect: 2,
      unattempted: 5
    },
    { 
      name: "Chapter 3", 
      totalQuestions: 25,
      correct: 10,
      incorrect: 5,
      unattempted: 10
    },
    { 
      name: "Chapter 4", 
      totalQuestions: 30,
      correct: 20,
      incorrect: 4,
      unattempted: 6
    },
    { 
      name: "Chapter 5", 
      totalQuestions: 18,
      correct: 5,
      incorrect: 3,
      unattempted: 10
    },
    { 
      name: "Chapter 6", 
      totalQuestions: 22,
      correct: 8,
      incorrect: 4,
      unattempted: 10
    },
    { 
      name: "Chapter 7", 
      totalQuestions: 25,
      correct: 15,
      incorrect: 5,
      unattempted: 5
    },
    { 
      name: "Chapter 8", 
      totalQuestions: 20,
      correct: 10,
      incorrect: 5,
      unattempted: 5
    },
    { 
      name: "Chapter 9", 
      totalQuestions: 28,
      correct: 18,
      incorrect: 6,
      unattempted: 4
    },
    { 
      name: "Chapter 10", 
      totalQuestions: 24,
      correct: 14,
      incorrect: 4,
      unattempted: 6
    },
  ];

  const calculatePercentage = (value: number, total: number) => {
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
        const correctPercent = calculatePercentage(chapter.correct, chapter.totalQuestions);
        const incorrectPercent = calculatePercentage(chapter.incorrect, chapter.totalQuestions);
        const unattemptedPercent = calculatePercentage(chapter.unattempted, chapter.totalQuestions);
        const coveredQuestions = chapter.correct + chapter.incorrect;
        const totalProgress = calculatePercentage(coveredQuestions, chapter.totalQuestions);

        return (
          <div key={index} className="space-y-2 p-4 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">{chapter.name}</span>
              <span className="text-gray-500">
                {coveredQuestions}/{chapter.totalQuestions} ({totalProgress.toFixed(1)}%)
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