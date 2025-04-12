
// components/practice/ContentSection.tsx
import { Question } from "@/types/QuestionInterface";
import { CheckCircle, XCircle } from "lucide-react";
import React from "react";

interface ContentSectionProps {
  activeTab: "problem" | "solution" | "quote";
  question: Question;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  onAnswerSelected: (answer: string) => void;
}

const ContentSection = ({
  activeTab,
  question,
  selectedAnswer,
  isCorrect,
  onAnswerSelected
}: ContentSectionProps) => {
  const getAnswerButtonStyles = (answer: string) => {
    if (selectedAnswer !== answer)
      return "border-2 border-gray-200 rounded-full p-4 hover:bg-gray-50 transition-all text-left flex justify-between items-center";
    if (answer === question.correctAnswer)
      return "border-2 border-emerald-500 bg-emerald-50 rounded-full p-4 transition-all text-left flex justify-between items-center animate-pulse";
    return "border-2 border-red-500 bg-red-50 rounded-full p-4 transition-all text-left flex justify-between items-center animate-pulse";
  };

  return (
    <div className="flex-1 p-8 max-w-3xl mx-auto">
      {/* Question Content */}
      <div className="mb-8 text-center">
        <div className="text-sm text-gray-500 mb-2 flex items-center justify-center gap-2">
          <span>Problem Solution Quote</span>
        </div>
        <h2 className="text-2xl font-medium" dangerouslySetInnerHTML={{ __html: question.content }} />
      </div>

      {/* Dynamic Content based on Tab */}
      {activeTab === "problem" && (
        <div className="grid grid-cols-2 gap-4 mb-12">
          {question.choices.map((answer) => (
            <button
              key={answer}
              className={getAnswerButtonStyles(answer)}
              onClick={() => onAnswerSelected(answer)}
            >
              <span dangerouslySetInnerHTML={{ __html: answer }} />
              {selectedAnswer === answer && isCorrect !== null && (
                isCorrect ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
              )}
            </button>
          ))}
        </div>
      )}

      {activeTab === "solution" && (
        <div className="prose max-w-none mb-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Step-by-Step Solution</h3>
          <div dangerouslySetInnerHTML={{ __html: question.solution }} />
          {question.explanation && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <h4 className="font-medium mb-2">Explanation</h4>
              <p>{question.explanation}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "quote" && (
        <div className="prose max-w-none mb-12 p-6 pt-24 bg-gray-50 rounded-lg">
          {question.quote && (
            <blockquote className="text-xl italic text-gray-700">
              "{question.quote.text}"
              {question.quote.source && (
                <footer className="mt-2 text-gray-500">- {question.quote.source}</footer>
              )}
            </blockquote>
          )}
        </div>
      )}

      {/* Trusted By Section */}
      <div className="mt-16 text-center text-sm text-gray-500">
        <div className="mb-4 flex items-center justify-center gap-2">
          <div className="h-px w-16 bg-gray-300" />
          TRUSTED BY
          <div className="h-px w-16 bg-gray-300" />
        </div>
        <div className="flex justify-center gap-6 text-gray-600 font-medium">
          <span>Company A</span>
          <span>Company B</span>
          <span>Company C</span>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;
