
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

interface ProgressData {
  total_questions: number;
  correct_count: number;
  incorrect_count: number;
  unattempted_count: number;
  total_progress_percent?: number;
}

interface TotalProgressCardProps {
  totalQuestions?: number;
  correctQuestions?: number;
  incorrectQuestions?: number;
  unattemptedQuestions?: number;
  progressData?: ProgressData;
  alwaysVisible?: boolean;
}

export const TotalProgressCard = ({ 
  totalQuestions: propsTotalQuestions,
  correctQuestions: propsCorrectQuestions,
  incorrectQuestions: propsIncorrectQuestions,
  unattemptedQuestions: propsUnattemptedQuestions,
  progressData: propsProgressData,
  alwaysVisible = true
}: TotalProgressCardProps) => {
  const { session } = useAuth();
  const [localProgress, setLocalProgress] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!session?.user?.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !currentSession?.access_token) {
          throw new Error('Authentication required');
        }

        // Use environment variable for Supabase URL
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://eantvimmgdmxzwrjwrop.supabase.co";
        
        const res = await fetch(`${supabaseUrl}/functions/v1/get-user-progress`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${currentSession.access_token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();

        if (data) {
          setLocalProgress({
            total_questions: data.total_questions || 0,
            correct_count: data.correct_count || 0,
            incorrect_count: data.incorrect_count || 0,
            unattempted_count: data.unattempted_count || 0
          });
        }
      } catch (err) {
        console.error('Error fetching progress:', err);
        setError(err as Error);
        toast.error("Failed to load progress data. Using fallback data.");
        
        // Set fallback values that match the design
        setLocalProgress({
          total_questions: 130,
          correct_count: 53,
          incorrect_count: 21,
          unattempted_count: 56
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [session]);

  const displayData = propsProgressData || {
    total_questions: propsTotalQuestions || localProgress?.total_questions || 130,
    correct_count: propsCorrectQuestions || localProgress?.correct_count || 53,
    incorrect_count: propsIncorrectQuestions || localProgress?.incorrect_count || 21,
    unattempted_count: propsUnattemptedQuestions || localProgress?.unattempted_count || 56
  };

  const { 
    total_questions: totalQuestionsValue,
    correct_count: correctQuestionsValue,
    incorrect_count: incorrectQuestionsValue,
    unattempted_count: unattemptedQuestionsValue
  } = displayData;

  const totalProgress = Math.round((correctQuestionsValue + incorrectQuestionsValue) / totalQuestionsValue * 100);
  const correctPercentage = Math.round(correctQuestionsValue / totalQuestionsValue * 100);
  const incorrectPercentage = Math.round(incorrectQuestionsValue / totalQuestionsValue * 100);
  const unattemptedPercentage = Math.round(unattemptedQuestionsValue / totalQuestionsValue * 100);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const correctOffset = circumference * (1 - correctQuestionsValue / totalQuestionsValue);
  const incorrectOffset = circumference * (1 - incorrectQuestionsValue / totalQuestionsValue);
  const unattemptedOffset = circumference * (1 - unattemptedQuestionsValue / totalQuestionsValue);

  return (
    <Card className="p-6 col-span-1 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-xl border border-slate-100 h-[480px]">
      <h3 className="text-lg font-semibold mb-6 text-center font-dancing-script bg-gradient-to-r from-blue-900 via-blue-600 to-slate-800 bg-clip-text text-transparent">
        Total Progress
      </h3>
      <div className="flex justify-between items-center space-x-8">
        {/* Fixed circular progress container */}
        <div className="relative flex items-center justify-center" style={{ width: '260px', height: '260px' }}>
          <motion.svg 
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            animate={{ 
              rotate: [-2, 2, -2],
              scale: [0.99, 1.01, 0.99]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Background circle */}
            <circle 
              cx="50" 
              cy="50" 
              r={radius} 
              fill="none" 
              stroke="#f1f5f9" 
              strokeWidth="2"
            />
            
            {/* Progress segments with vivid colors */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#22c55e"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={correctOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#ef4444"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={incorrectOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="url(#triColorGradient)"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={unattemptedOffset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            
            {/* Updated gradient definition */}
            <defs>
              <linearGradient id="triColorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </motion.svg>
          
          {/* Centered text */}
          <div className="flex flex-col items-center justify-center text-center z-10">
            <span className="text-5xl font-bold bg-gradient-to-r from-blue-900 via-blue-600 to-slate-800 bg-clip-text text-transparent">
              {totalProgress}%
            </span>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-sm font-medium text-blue-800">
                {correctQuestionsValue + incorrectQuestionsValue}
              </span>
              <span className="text-sm text-slate-400">/</span>
              <span className="text-sm text-slate-600">{totalQuestionsValue}</span>
            </div>
            <span className="text-xs text-slate-500 mt-1">completed</span>
          </div>
        </div>
        
        <div className="flex-1 space-y-4 pt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-sm text-slate-600">Correct:</span>
              <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent glow-text-emerald">
                {correctQuestionsValue}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <span className="text-sm text-slate-600">Incorrect:</span>
              <span className="text-sm font-semibold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent glow-text-red">
                {incorrectQuestionsValue}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
              <span className="text-sm text-slate-600">Unattempted:</span>
              <span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent glow-text-orange">
                {unattemptedQuestionsValue}
              </span>
            </div>
          </div>
          
          <div className="pt-4 space-y-3 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Avg Score:</span>
              <span className="text-sm font-medium text-blue-600 glow-text-blue">92%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Avg Speed:</span>
              <span className="text-sm font-medium text-blue-600 glow-text-blue">2.5 min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Success Rate:</span>
              <span className="text-sm font-medium text-blue-600 glow-text-blue">85%</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
