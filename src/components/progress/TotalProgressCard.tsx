
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
}

export const TotalProgressCard = ({ 
  totalQuestions: propsTotalQuestions,
  correctQuestions: propsCorrectQuestions,
  incorrectQuestions: propsIncorrectQuestions,
  unattemptedQuestions: propsUnattemptedQuestions,
  progressData: propsProgressData 
}: TotalProgressCardProps) => {
  const { session } = useAuth();
  const [localProgress, setLocalProgress] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!session) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const res = await fetch("https://eantvimmgdmxzwrjwrop.supabase.co/functions/v1/get-apijson", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${session.access_token}`
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhbnR2aW1tZ2RteHp3cmp3cm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNTk0OTEsImV4cCI6MjA1OTYzNTQ5MX0.A4T0RL_luqzFIPSikCllFpNJtwxcVaLiDm_BCBlRcu8'
          }
        });
        
        const data = await res.json();

        if (error) {
          throw new Error(`Error fetching progress: ${error.message}`);
        }

        if (data) {
          setLocalProgress({
            total_questions: data.total_questions,
            correct_count: data.correct_count,
            incorrect_count: data.incorrect_count,
            unattempted_count: data.unattempted_count
          });
        } else {
          // If no data is returned, try direct query as fallback
          try {
            const { data: directData, error: directError } = await supabase
              .from("user_progress")
              .select("total_questions, correct_count, incorrect_count, unattempted_count")
              .eq("user_id", session.user.id)
              .single();

            if (directError) throw directError;

            if (directData) {
              setLocalProgress({
                total_questions: directData.total_questions,
                correct_count: directData.correct_count,
                incorrect_count: directData.incorrect_count,
                unattempted_count: directData.unattempted_count
              });
            }
          } catch (fallbackError) {
            console.error('Fallback query failed:', fallbackError);
            // Continue to the fallback data below
          }
        }
      } catch (err) {
        console.error('Error fetching progress:', err);
        setError(err as Error);
        toast.error("Failed to load progress data. Using fallback data.");
        
        // Set fallback data
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
    total_questions: propsTotalQuestions || localProgress?.total_questions || 100,
    correct_count: propsCorrectQuestions || localProgress?.correct_count || 0,
    incorrect_count: propsIncorrectQuestions || localProgress?.incorrect_count || 0,
    unattempted_count: propsUnattemptedQuestions || localProgress?.unattempted_count || 100
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
    <Card className="p-6 col-span-1 shadow-md hover:shadow-xl transition-all duration-300 shadow-[0_0_15px_rgba(155,135,245,0.2)] border-0 bg-slate-50 rounded-md py-[15px]">
      <h3 className="text-lg font-semibold mb-6 text-center text-indigo-950">Total Progress</h3>
      <div className="space-y-8">
        <div className="flex justify-center">
          <SegmentedProgress 
            progress={totalProgress} 
            className="w-56 h-56 md:w-60 md:h-60" 
            total={totalQuestionsValue} 
            completed={correctQuestionsValue + incorrectQuestionsValue} 
          />
        </div>
        <div className="space-y-4">
          <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-gray-100">
            <motion.div 
              className="bg-emerald-500" 
              style={{ width: `${correctPercentage}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${correctPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <motion.div 
              className="bg-rose-500" 
              style={{ width: `${incorrectPercentage}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${incorrectPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            />
            <motion.div 
              className="bg-amber-500" 
              style={{ width: `${unattemptedPercentage}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${unattemptedPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <span>{correctPercentage}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
              <span>{incorrectPercentage}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
              <span>{unattemptedPercentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
