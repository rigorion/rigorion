import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import SegmentedProgress from "@/components/SegmentedProgress";
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface ProgressData {
  total_questions: number;
  correct_count: number;
  incorrect_count: number;
  unattempted_count: number;
}

interface TotalProgressCardProps {
  progressData?: ProgressData;
}

export const TotalProgressCard = ({ progressData }: TotalProgressCardProps) => {
  const { session } = useAuth();
  const [localProgress, setLocalProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!session) return;
      
      try {
        const { data, error } = await supabase.functions.invoke('get-user-progress', {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });

        if (!error && data) {
          setLocalProgress(data);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchProgress();
  }, [session]);

  // Use props if provided, otherwise use local state
  const displayData = progressData || localProgress;

  if (!displayData) {
    return (
      <Card className="p-6 col-span-1 shadow-md hover:shadow-xl transition-all duration-300 shadow-[0_0_15px_rgba(155,135,245,0.2)] border-0 bg-slate-50 rounded-md py-[15px]">
        <div className="text-center text-gray-500">Loading progress data...</div>
      </Card>
    );
  }

  const { 
    total_questions: totalQuestions,
    correct_count: correctQuestions,
    incorrect_count: incorrectQuestions,
    unattempted_count: unattemptedQuestions
  } = displayData;

  const totalProgress = Math.round((correctQuestions + incorrectQuestions) / totalQuestions * 100);
  const correctPercentage = Math.round(correctQuestions / totalQuestions * 100);
  const incorrectPercentage = Math.round(incorrectQuestions / totalQuestions * 100);
  const unattemptedPercentage = Math.round(unattemptedQuestions / totalQuestions * 100);

  return (
    <Card className="p-6 col-span-1 shadow-md hover:shadow-xl transition-all duration-300 shadow-[0_0_15px_rgba(155,135,245,0.2)] border-0 bg-slate-50 rounded-md py-[15px]">
      <h3 className="text-lg font-semibold mb-6 text-center text-indigo-950">Total Progress</h3>
      <div className="space-y-8">
        <div className="flex justify-center">
          <SegmentedProgress 
            progress={totalProgress} 
            className="w-56 h-56 md:w-60 md:h-60" 
            total={totalQuestions} 
            completed={correctQuestions + incorrectQuestions} 
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
