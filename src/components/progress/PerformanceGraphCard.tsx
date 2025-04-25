import { Card } from "@/components/ui/card";
import { ProgressChart } from "./ProgressChart";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';

interface PerformanceDataPoint {
  date: string;
  attempted: number;
}

interface PerformanceGraphCardProps {
  data?: PerformanceDataPoint[];
}

export const PerformanceGraphCard = ({
  data: propData
}: PerformanceGraphCardProps) => {
  const [performanceData, setPerformanceData] = useState<PerformanceDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (propData && propData.length > 0) {
        setPerformanceData(propData);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        
        const response = await fetch(`${supabaseUrl}/functions/v1/get-performance`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching performance data: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Performance data fetched:", data);

        if (data && Array.isArray(data.performance_graph)) {
          setPerformanceData(data.performance_graph);
        } else {
          generateFallbackData();
        }
      } catch (error) {
        console.error('Failed to fetch performance data:', error);
        toast.error("Could not load performance data. Using sample data.");
        generateFallbackData();
      } finally {
        setIsLoading(false);
      }
    };

    const generateFallbackData = () => {
      const today = new Date();
      const dummyData = [];
      
      for (let i = 9; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0];
        
        dummyData.push({
          date: formattedDate,
          attempted: Math.floor(Math.random() * 30) + 10,
        });
      }
      
      setPerformanceData(dummyData);
    };

    fetchPerformanceData();
  }, [propData]);

  const displayData = propData || performanceData || [];

  // Calculate if there's a trend by comparing the last 3 days to the previous 3 days
  const calculateTrend = () => {
    if (displayData.length < 6) return {
      trend: 0,
      percentage: 0
    };
    const recentDays = displayData.slice(-3).reduce((sum, item) => sum + item.attempted, 0);
    const previousDays = displayData.slice(-6, -3).reduce((sum, item) => sum + item.attempted, 0);
    if (previousDays === 0) return {
      trend: 0,
      percentage: 0
    };
    const percentChange = (recentDays - previousDays) / previousDays * 100;
    return {
      trend: Math.sign(percentChange),
      percentage: Math.abs(Math.round(percentChange))
    };
  };
  
  const trend = calculateTrend();

  // Calculate average questions per day
  const averageQuestions = displayData.length > 0 
    ? Math.round(displayData.reduce((sum, item) => sum + item.attempted, 0) / displayData.length) 
    : 0;
  
  // Update the loading state UI
  if (isLoading) {
    return (
      <Card className="p-6 hover:shadow-lg transition-all duration-300 h-[480px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Performance Analysis</h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Loading performance data...</p>
        </div>
      </Card>
    );
  }
  
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" }
        }
      }}
      initial="hidden"
      animate="visible"
      className="h-[480px]" // Match height with TotalProgressCard
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm h-full">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium text-gray-600">
            Avg: {averageQuestions} questions/day
          </div>
          
          {trend.trend !== 0 && (
            <div className={`flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full ${
              trend.trend > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {trend.trend > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              <span>{trend.percentage}%</span>
            </div>
          )}
        </div>
        <ProgressChart data={displayData} />
      </Card>
    </motion.div>
  );
};
