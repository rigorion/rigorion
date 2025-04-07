import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus, X } from "lucide-react";

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
          className="w-full flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2"
          size="sm"
        >
          <MessageCircle className="h-5 w-5 text-gray-600" />
          <span className="text-gray-600">Write a comment...</span>
        </Button>
      )}

      {/* Comment Input Area (opens upward) */}
      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-96 bg-white rounded-lg shadow-[0_0_10px_rgba(59,130,246,0.7)] transition-all duration-500 ease-in-out p-4">
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
              className="bg-white text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300 p-1 rounded-full"
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
            {/* Cancel Button */}
            <Button
              onClick={handleToggle}
              className="bg-white text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-300 p-1 rounded-full"
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
            {/* Send Button */}
            <Button
              onClick={handleSend}
              className="bg-white text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300 p-1 rounded-full"
              size="sm"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
