
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { storeSecureFunctionData } from "@/services/secureIndexedDbService";
import { useQueryClient } from "@tanstack/react-query";

interface SecureProgressDataButtonProps {
  onRefresh: () => void;
}

const SecureProgressDataButton = ({ onRefresh }: SecureProgressDataButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchAndStoreProgressData = async () => {
    setLoading(true);
    try {
      // Fetch from edge function
      const response = await fetch('https://eantvimmgdmxzwrjwrop.supabase.co/functions/v1/get-user-progress', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Fetched progress data:", result);
      
      // Store the data securely
      await storeSecureFunctionData('get-user-progress', result);
      
      toast({
        title: "Progress Data Encrypted & Stored",
        description: "Your progress data has been securely stored offline",
        duration: 3000,
      });
      
      // Invalidate React Query cache to refresh data
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      
      // Trigger a refresh of the progress data
      onRefresh();
      
    } catch (error) {
      console.error("Error fetching or storing progress data:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch or store progress data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={fetchAndStoreProgressData}
      disabled={loading}
      className="flex items-center gap-1"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Lock className="h-3.5 w-3.5" />
      )}
      <span>Secure Sync</span>
    </Button>
  );
};

export default SecureProgressDataButton;
