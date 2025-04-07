import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Clock, Star } from "lucide-react";

const CommunityStats = () => {
  const [comment, setComment] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | null>(null);

  // Mock community data (replace with real data from API)
  const communityStats = {
    difficultyDistribution: {
      easy: 45,
      medium: 35,
      hard: 20
    },
    averageTime: "2m 15s",
    correctPercentage: 68,
    totalResponses: 2450
  };

  const handleSubmitFeedback = () => {
    console.log({ comment, difficulty });
    setComment("");
    setDifficulty(null);
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
                    style={{ width: `${communityStats.difficultyDistribution.easy}%` }}
                  />
                  <div 
                    className="bg-yellow-500" 
                    style={{ width: `${communityStats.difficultyDistribution.medium}%` }}
                  />
                  <div 
                    className="bg-red-500" 
                    style={{ width: `${communityStats.difficultyDistribution.hard}%` }}
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
            <div className="text-lg font-medium">{communityStats.averageTime}</div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="h-4 w-4" />
              <span>Accuracy</span>
            </div>
            <div className="text-lg font-medium">{communityStats.correctPercentage}%</div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Total Responses</span>
            </div>
            <div className="text-lg font-medium">
              {communityStats.totalResponses.toLocaleString()}
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
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      Post Comment
    </Button>
  </div>

  {/* Recent Comments List */}
  <div>
    <div className="text-sm font-medium mb-2">Recent Community Comments</div>
    <div className="space-y-3 min-h-[200px] max-h-[300px] overflow-y-auto pr-2">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
      ))}
    </div>
  </div>
</div>
    </div>
  );
};

export default CommunityStats;