import { useEffect, useState } from "react";
import { fetchProgressEndpoints, processProgressData } from "@/services/progressEndpointsService";
import { UserProgressData } from "@/types/progress";
import { toast } from "@/hooks/use-toast";
import { ErrorDisplay } from "./ErrorDisplay";

interface ProgressDataProviderProps {
  children: (data: UserProgressData) => React.ReactNode;
  fallbackData: UserProgressData;
  showLoadingState?: boolean;
}

export const ProgressDataProvider = ({
  children,
  fallbackData,
  showLoadingState = true
}: ProgressDataProviderProps) => {
  const [data, setData] = useState<UserProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const endpointsData = await fetchProgressEndpoints();
        const processedData = processProgressData(endpointsData);
        
        console.log("Processed progress data:", processedData);
        setData(processedData);
      } catch (err) {
        console.error("Error fetching progress data:", err);
        setError(err as Error);
        toast.error("Could not load all progress data. Some information may be incomplete.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // If there's a critical error, show the error display
  if (error && !data) {
    return <ErrorDisplay error={error} />;
  }
  
  // Merge fallback data with any available data from API
  const displayData = data || fallbackData;
  
  if (isLoading && showLoadingState) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading progress data...</p>
        </div>
      </div>
    );
  }
  
  return <>{children(displayData)}</>;
};

export default ProgressDataProvider;
