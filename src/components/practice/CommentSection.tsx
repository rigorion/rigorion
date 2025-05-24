
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus, X, Send } from "lucide-react";

const CommentSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");

  const handleToggle = () => setIsOpen((prev) => !prev);
  
  const handleSend = () => {
    // Implement your send logic here
    console.log("Comment submitted:", comment);
    setComment("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Trigger Button */}
      {!isOpen && (
        <Button
          onClick={handleToggle}
          className="rounded-full bg-blue-600 hover:bg-blue-700 text-white p-3 h-12 w-12 shadow-lg flex items-center justify-center"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      )}

      {/* Comment Input Area (opens upward) */}
      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 w-96 bg-white rounded-lg shadow-[0_0_10px_rgba(59,130,246,0.7)] transition-all duration-500 ease-in-out p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Write your comment</h4>
            <Button
              onClick={handleToggle}
              className="p-1 h-6 w-6 rounded-full bg-gray-100"
              size="sm"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-[7.5rem] overflow-y-auto"
            rows={5}
          />
          
          {/* Action Buttons */}
          <div className="flex justify-end mt-2 gap-2">
            {/* Image Upload (Plus Icon) */}
            <Button
              onClick={() => console.log("Upload image")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 h-8 w-8"
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            {/* Send Button */}
            <Button
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full pl-3 pr-4 py-1 h-8 flex items-center gap-1"
              size="sm"
            >
              <Send className="h-3 w-3" />
              <span className="text-xs">Send</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
