
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const CommentSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);

  const handleSubmit = () => {
    if (comment.trim()) {
      setComments([...comments, comment]);
      setComment("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative">
      {/* Comment Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        size="sm"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>

      {/* Comment Panel */}
      {isOpen && (
        <Card className="absolute bottom-16 left-0 w-80 max-w-[calc(100vw-2rem)] shadow-xl border-2 border-blue-200 z-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Comments</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Comments List */}
            <div className="max-h-32 overflow-y-auto mb-3 space-y-2">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-sm">No comments yet.</p>
              ) : (
                comments.map((c, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                    {c}
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <div className="flex gap-2">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a comment..."
                className="flex-1 min-h-[60px] resize-none text-sm"
                rows={2}
              />
              <Button
                onClick={handleSubmit}
                disabled={!comment.trim()}
                size="sm"
                className="self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommentSection;
