
import type { UserProgressData } from '@/types/progress';

export async function getUserProgressData(userId: string, period: string = "weekly"): Promise<UserProgressData> {
  console.log('Getting user progress data for:', userId);
  
  // Return dummy data directly
  return {
    userId,
    totalProgressPercent: 75,
    correctAnswers: 53,
    incorrectAnswers: 21,
    unattemptedQuestions: 56,
    questionsAnsweredToday: 12,
    streak: 7,
    averageScore: 92,
    rank: 120,
    projectedScore: 92,
    speed: 85,
    easyAccuracy: 90,
    easyAvgTime: 1.5,
    easyCompleted: 45,
    easyTotal: 50,
    mediumAccuracy: 70,
    mediumAvgTime: 2.5,
    mediumCompleted: 35,
    mediumTotal: 50,
    hardAccuracy: 83,
    hardAvgTime: 4.0,
    hardCompleted: 25,
    hardTotal: 30,
    goalAchievementPercent: 75,
    averageTime: 2.5,
    correctAnswerAvgTime: 2.0,
    incorrectAnswerAvgTime: 3.5,
    longestQuestionTime: 8.0,
    performanceGraph: Array.from({ length: 10 }, (_, i) => ({
      date: new Date(Date.now() - (9 - i) * 24 * 3600 * 1000).toISOString().slice(0, 10),
      attempted: Math.floor(Math.random() * 30) + 10
    })),
    chapterPerformance: [
      { chapterId: '1', chapterName: 'Chapter 1', correct: 12, incorrect: 3, unattempted: 5 },
      { chapterId: '2', chapterName: 'Chapter 2', correct: 8, incorrect: 2, unattempted: 5 },
      { chapterId: '3', chapterName: 'Chapter 3', correct: 10, incorrect: 5, unattempted: 10 },
      { chapterId: '4', chapterName: 'Chapter 4', correct: 20, incorrect: 4, unattempted: 6 },
      { chapterId: '5', chapterName: 'Chapter 5', correct: 5, incorrect: 3, unattempted: 10 }
    ],
    goals: [
      { id: '1', title: 'Complete 100 Questions', targetValue: 100, currentValue: 75, dueDate: '2024-05-01' },
      { id: '2', title: 'Achieve 90% in Hard Questions', targetValue: 90, currentValue: 83, dueDate: '2024-05-15' }
    ]
  };
}
