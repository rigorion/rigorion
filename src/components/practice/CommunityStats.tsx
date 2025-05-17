import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Clock, Star } from "lucide-react";
import { fetchTable } from "@/services/tableDataService";
import { toast } from "@/hooks/use-toast";

// Define the community stats interface based on your database schema
interface CommunityStatRecord {
  question_id: string;
  total_attempts: number;
  correct_count: number;
  incorrect_count: number;
  avg_time_spent_sec: number;
}

const CommunityStats = ({ questionId }: { questionId?: string }) => {
  const [comment, setComment] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{
    difficultyDistribution: {
      easy: number;
      medium: number;
      hard: number;
    };
    averageTime: string;
    correctPercentage: number;
    totalResponses: number;
  }>({
    difficultyDistribution: {
      easy: 45,
      medium: 35,
      hard: 20
    },
    averageTime: "2m 15s",
    correctPercentage: 68,
    totalResponses: 0
  });

  // Fetch community stats from Supabase
  useEffect(() => {
    const fetchCommunityStats = async () => {
      setLoading(true);
      try {
        // Fetch community stats from the database
        const { data } = await fetchTable('community_stats');
        
        if (data && Array.isArray(data) && data.length > 0) {
          console.log("Community stats data:", data);
          
          // Make sure we're working with properly typed data
          const typedData = data as CommunityStatRecord[];
          
          // Calculate stats from the data - with explicit initial values
          const totalAttempts = typedData.reduce((sum: number, stat: CommunityStatRecord) => 
            sum + (Number(stat.total_attempts) || 0), 0);
          
          const totalCorrect = typedData.reduce((sum: number, stat: CommunityStatRecord) => 
            sum + (Number(stat.correct_count) || 0), 0);
          
          // Calculate average time in seconds - with explicit initial values
          const totalTime = typedData.reduce((sum: number, stat: CommunityStatRecord) => 
            sum + (Number(stat.avg_time_spent_sec) || 0), 0);
          
          const avgTimeInSec = typedData.length > 0 ? totalTime / typedData.length : 0;
          
          // Format the time into minutes and seconds
          const minutes = Math.floor(avgTimeInSec / 60);
          const seconds = Math.round(avgTimeInSec % 60);
          const formattedTime = `${minutes}m ${seconds}s`;
          
          // Calculate correct percentage
          const correctPercentage = totalAttempts > 0 
            ? Math.round((totalCorrect / totalAttempts) * 100)
            : 0;
          
          // Update stats state
          setStats({
            difficultyDistribution: {
              easy: 45, // We keep this distribution for now as it's not in the schema
              medium: 35,
              hard: 20
            },
            averageTime: formattedTime,
            correctPercentage: correctPercentage,
            totalResponses: totalAttempts
          });
        }
      } catch (error) {
        console.error("Error fetching community stats:", error);
        toast({
          title: "Error",
          description: "Failed to load community statistics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityStats();
  }, [questionId]);

  const handleSubmitFeedback = async () => {
    if (!difficulty) {
      toast({
        title: "Please select a difficulty",
        description: "Choose easy, medium, or hard before submitting",
        variant: "default",
      });
      return;
    }

    console.log({ comment, difficulty });
    
    // Here you could potentially update the community stats in the database
    // For example:
    /*
    try {
      await supabase.from('community_stats').upsert({
        question_id: questionId, 
        // other fields to update based on the user feedback
      });
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
    }
    */

    setComment("");
    setDifficulty(null);
    
    toast({
      title: "Feedback submitted",
      description: "Thank you for your feedback!",
    });
  };

  return (
    <div className="border-t px-6 py-4 bg-transparent grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Stats */}
      <div className="space-y-6">
        {/* Difficulty Section - Inline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            {/* Difficulty Bar */}
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Star className="h-4 w-4" />
                <span>Difficulty</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="flex h-full">
                  <div 
                    className="bg-emerald-500" 
                    style={{ width: `${stats.difficultyDistribution.easy}%` }}
                  />
                  <div 
                    className="bg-yellow-500" 
                    style={{ width: `${stats.difficultyDistribution.medium}%` }}
                  />
                  <div 
                    className="bg-red-500" 
                    style={{ width: `${stats.difficultyDistribution.hard}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Rate Difficulty Buttons */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Rate Difficulty:</span>
              <div className="flex gap-2">
                <Button
                  variant={difficulty === "easy" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full ${difficulty === "easy" ? "bg-emerald-500 text-white" : ""}`}
                  onClick={() => setDifficulty("easy")}
                >
                  Easy
                </Button>
                <Button
                  variant={difficulty === "medium" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full ${difficulty === "medium" ? "bg-yellow-500 text-white" : ""}`}
                  onClick={() => setDifficulty("medium")}
                >
                  Medium
                </Button>
                <Button
                  variant={difficulty === "hard" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full ${difficulty === "hard" ? "bg-red-500 text-white" : ""}`}
                  onClick={() => setDifficulty("hard")}
                >
                  Hard
                </Button>
              </div>
            </div>
          </div>

          {/* Difficulty Labels */}
          <div className="flex justify-between text-xs">
            <span className="text-emerald-600">Easy</span>
            <span className="text-yellow-600">Medium</span>
            <span className="text-red-600">Hard</span>
          </div>
        </div>

        {/* Other Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Avg. Time</span>
            </div>
            <div className="text-lg font-medium">
              {loading ? "Loading..." : stats.averageTime}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="h-4 w-4" />
              <span>Accuracy</span>
            </div>
            <div className="text-lg font-medium">
              {loading ? "Loading..." : `${stats.correctPercentage}%`}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Total Responses</span>
            </div>
            <div className="text-lg font-medium">
              {loading ? "Loading..." : stats.totalResponses.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Comments */}
      <div className="space-y-4">
        {/* Comment Input */}
        <div className="relative">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this question..."
            className="w-full p-3 border-b focus:outline-none focus:border-blue-500 resize-none"
            rows={2}
          />
          <Button
            onClick={handleSubmitFeedback}
            className="mt-2 bg-white border-1 border-blue rounded-full text-blue-500 hover:bg-blue-600 float-right text-blue-300"
            size="sm"
            disabled={loading}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Post Comment
          </Button>
        </div>

        {/* Recent Comments List */}
        <div>
          <div className="text-sm font-medium mb-2">Recent Community Comments</div>
          <div className="space-y-3 min-h-[200px] max-h-[300px] overflow-y-auto pr-2">
            {loading ? (
              <div className="text-center p-4">Loading comments...</div>
            ) : (
              [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">User{i}</span>
                    <span className="text-gray-600">
                      {i % 2 === 0 
                        ? "Great question for understanding core concepts!"
                        : "Took me a few tries to get this right"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityStats;
