
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
  const { session } = useAuth();
  const [performanceData, setPerformanceData] = useState<PerformanceDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (!session) return;
      
      setIsLoading(true);
      
      try {
        // First get a fresh access token from Supabase
        const { data: { session: currentSession }, error: tokenError } = await supabase.auth.getSession();
        
        if (tokenError) {
          throw new Error(`Error refreshing token: ${tokenError.message}`);
        }
        
        if (!currentSession) {
          throw new Error('No active session found');
        }
        
        // Use the access token from the current session
        const accessToken = currentSession.access_token;
        
        // Make the request to the edge function
        const res = await fetch("https://eantvimmgdmxzwrjwrop.supabase.co/functions/v1/get-progress", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          }
        });
        
        if (!res.ok) {
          console.error(`Server returned ${res.status}: ${res.statusText}`);
          throw new Error(`Error fetching performance data: ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log("Performance data fetched:", data);

        if (data && Array.isArray(data) && data.length > 0) {
          setPerformanceData(data);
        } else {
          // Fallback dummy data
          generateFallbackData();
        }
      } catch (error) {
        console.error('Failed to fetch performance data:', error);
        toast.error("Could not load performance data. Using sample data.");
        
        // Fallback to dummy data
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

    if (!propData || propData.length === 0) {
      fetchPerformanceData();
    } else {
      setPerformanceData(propData);
    }
  }, [session, propData]);

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
  
  if (isLoading) {
    return (
      <Card className="p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Performance Graph</h3>
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
        hidden: {
          opacity: 0,
          y: 20
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: "easeOut"
          }
        }
      }}
      initial="hidden"
      animate="visible"
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Performance Graph</h3>
          <div className="flex items-center gap-2">
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
        </div>
        <ProgressChart data={displayData} />
      </Card>
    </motion.div>
  );
};
