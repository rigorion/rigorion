
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import SegmentedProgress from "@/components/SegmentedProgress";
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

  // Use props if provided, otherwise use local state or generate placeholder data
  const displayData = propsProgressData || {
    total_questions: propsTotalQuestions || localProgress?.total_questions || 130,
    correct_count: propsCorrectQuestions || localProgress?.correct_count || 53,
    incorrect_count: propsIncorrectQuestions || localProgress?.incorrect_count || 21,
    unattempted_count: propsUnattemptedQuestions || localProgress?.unattempted_count || 56
  };

  if (isLoading) {
    return (
      <Card className="p-6 col-span-1 shadow-md hover:shadow-xl transition-all duration-300 shadow-[0_0_15px_rgba(155,135,245,0.2)] border-0 bg-slate-50 rounded-md py-[15px]">
        <div className="text-center text-gray-500">Loading progress data...</div>
      </Card>
    );
  }

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

  return (
    <Card className="p-6 col-span-1 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-100">
      <h3 className="text-lg font-semibold mb-6 text-center text-purple-600">
        Total Progress
      </h3>
      <div className="space-y-4">
        <div className="flex justify-center">
          <SegmentedProgress 
            progress={totalProgress} 
            className="w-64 h-64 md:w-72 md:h-72" 
            total={totalQuestionsValue} 
            completed={correctQuestionsValue + incorrectQuestionsValue} 
          />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
          <div className="bg-emerald-50 p-2 rounded-md">
            <div className="text-emerald-600 font-semibold">{correctQuestionsValue}</div>
            <div className="text-xs text-gray-500">Correct</div>
          </div>
          <div className="bg-amber-50 p-2 rounded-md">
            <div className="text-amber-600 font-semibold">{incorrectQuestionsValue}</div>
            <div className="text-xs text-gray-500">Incorrect</div>
          </div>
          <div className="bg-slate-50 p-2 rounded-md">
            <div className="text-slate-600 font-semibold">{unattemptedQuestionsValue}</div>
            <div className="text-xs text-gray-500">Unattempted</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
