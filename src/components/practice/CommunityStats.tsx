
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Clock, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { CommunityStatsData } from "@/types/community";

export function CommunityStats({ questionId }: { questionId: string }) {
  const [stats, setStats] = useState<CommunityStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!questionId) return;

      try {
        // Use type assertion to help TypeScript understand our intention
        const { data, error } = await (supabase
          .from("community_stats" as any)
          .select("*")
          .eq("question_id", questionId)
          .single()) as any;

        if (error) {
          console.error("Error fetching community stats:", error);
          return;
        }

        setStats(data);
      } catch (err) {
        console.error("Failed to load community stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [questionId]);

  if (loading) {
    return (
      <Card className="bg-muted/50 mb-4">
        <CardContent className="p-4">
          <div className="flex justify-center">
            <p className="text-sm text-muted-foreground">Loading community stats...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Validate the data structure
  const isValidData = (data: any): data is CommunityStatsData => {
    if (!data) {
      return false;
    }
    
    // Check if it's an object
    if (typeof data !== 'object') {
      return false;
    }
            
    // Then check if it has all required properties - with proper null checks
    return (
      data !== null &&
      typeof data === 'object' &&
      'total_attempts' in data && 
      'correct_count' in data && 
      'incorrect_count' in data && 
      'average_time_seconds' in data
    );
  };

  // If no stats or invalid data structure
  if (!stats || !isValidData(stats)) {
    return (
      <Card className="bg-muted/50 mb-4">
        <CardContent className="p-4">
          <div className="flex justify-center">
            <p className="text-sm text-muted-foreground">No community data available yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-muted/50 mb-4">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3">Community Stats</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center text-muted-foreground mb-1">
              <MessageCircle className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Attempts</span>
            </div>
            <span className="font-medium">{stats.total_attempts}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center text-muted-foreground mb-1">
              <Star className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Success</span>
            </div>
            <span className="font-medium">
              {stats.total_attempts > 0
                ? Math.round((stats.correct_count / stats.total_attempts) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center text-muted-foreground mb-1">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Avg Time</span>
            </div>
            <span className="font-medium">
              {stats.average_time_seconds
                ? `${Math.round(stats.average_time_seconds)}s`
                : "N/A"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
