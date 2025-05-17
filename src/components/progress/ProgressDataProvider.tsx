
import { useQuery } from "@tanstack/react-query";
import { fetchProgressEndpoints, processProgressData, fetchUserProgressFromEdge } from "@/services/progressEndpointsService";
import { UserProgressData } from "@/types/progress";
import { toast } from "@/components/ui/use-toast";
import { ErrorDisplay } from "./ErrorDisplay";
import { Skeleton } from "../ui/skeleton";
import { callEdgeFunction } from "@/services/edgeFunctionService";

interface ProgressDataProviderProps {
  children: (data: UserProgressData) => React.ReactNode;
  fallbackData: UserProgressData;
  showLoadingState?: boolean;
  timePeriod?: string;
}

export const ProgressDataProvider = ({
  children,
  fallbackData,
  showLoadingState = true,
  timePeriod = 'weekly'
}: ProgressDataProviderProps) => {
  // Use React Query to fetch and cache progress data
  const { data, isLoading, error } = useQuery({
    queryKey: ['userProgress', timePeriod],
    queryFn: async () => {
      try {
        // First try to fetch from the dedicated edge function using our new fetch utility
        const { data: progressData, error: progressError } = await callEdgeFunction(
          'get-user-progress',
          { method: 'GET' },
          { period: timePeriod }
        );
        
        if (!progressError && progressData && Array.isArray(progressData) && progressData.length > 0) {
          console.log("Loaded progress data from edge function:", progressData);
          // Transform edge function response to match our UserProgressData type
          return processProgressData(progressData);
        }
        
        // Fall back to the generic endpoint approach if edge function fails
        const endpointsData = await fetchProgressEndpoints();
        console.log("Loaded progress data from multiple endpoints:", endpointsData);
        return processProgressData(endpointsData);
      } catch (err) {
        console.error("Error fetching progress data:", err);
        toast({
          title: "Error",
          description: "Could not load all progress data. Some information may be incomplete.",
          variant: "destructive",
        });
        throw err;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
  
  // If there's a critical error, show the error display
  if (error && !data) {
    return <ErrorDisplay error={error as Error} />;
  }
  
  // Merge fallback data with any available data from API
  const displayData = data || fallbackData;
  
  if (isLoading && showLoadingState) {
    return (
      <div className="space-y-4 w-full">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  return <>{children(displayData)}</>;
};

export default ProgressDataProvider;
