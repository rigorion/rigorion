
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Bookmark, ChevronLeft, ChevronRight, ArrowRight, 
  Mail, MessageCircle, Music, Music2, Music4, 
  Share2, Users 
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface PracticeFooterProps {
  onToggleCommunityStats: () => void;
  onPrevious: () => void;
  onNext: () => void;
  currentQuestionIndex: number;
  totalQuestions: number;
  showGoToInput: boolean;
  setShowGoToInput: (show: boolean) => void;
  targetQuestion: string;
  setTargetQuestion: (value: string) => void;
  handleGoToQuestion: () => void;
  inputError: string;
}

const PracticeFooter = ({ 
  onToggleCommunityStats, 
  onPrevious,
  onNext,
  currentQuestionIndex,
  totalQuestions,
  showGoToInput,
  setShowGoToInput,
  targetQuestion,
  setTargetQuestion,
  handleGoToQuestion,
  inputError
}: PracticeFooterProps) => {
  const [isMusicMenuOpen, setIsMusicMenuOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showCommentsPopover, setShowCommentsPopover] = useState(false);

  const handleMusicSelect = (trackPath: string) => {
    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
    }
    const newAudio = new Audio(trackPath);
    newAudio.loop = true;
    newAudio.play().catch(e => console.log("Audio playback failed:", e));
    setAudioElement(newAudio);
    setCurrentTrack(trackPath);
    setIsMusicMenuOpen(false);
  };

  const handleShare = (platform: string) => {
    const currentUrl = window.location.href;
    const message = "Check out this practice platform: ";
    switch(platform) {
      case 'whatsapp':
        window.open(`whatsapp://send?text=${encodeURIComponent(message + currentUrl)}`);
        break;
      case 'email':
        window.open(`mailto:?body=${encodeURIComponent(message + currentUrl)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(currentUrl);
        break;
      default:
        window.open(`https://${platform}.com/share?url=${encodeURIComponent(currentUrl)}`);
    }
    setShowShareDialog(false);
  };

  return (
    <div className="border-t px-6 py-4 flex items-center justify-between gap-4 bg-gray-50">
      {/* Navigation Controls - Left Side */}
      <Button
        variant="ghost"
        className="rounded-full"
        onClick={onPrevious}
        disabled={currentQuestionIndex <= 0}
      >
        <ChevronLeft className="h-4 w-4 text-[#1EAEDB] mr-1" />
        Previous
      </Button>

      {/* Center Section with Features */}
      <div className="flex items-center gap-3 justify-center flex-grow">
        {/* Music Menu Button */}
        <div className="relative">
          <Popover open={isMusicMenuOpen} onOpenChange={setIsMusicMenuOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-transparent hover:bg-blue-50"
              >
                <Music className="h-4 w-4 text-[#1EAEDB]" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2 bg-white border rounded-lg shadow-lg animate-in fade-in-80 slide-in-from-bottom-5">
              <div className="text-sm text-gray-700 px-3 py-1">Background Music</div>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleMusicSelect("/music/ambient.mp3")}
              >
                <Music2 className="h-4 w-4 mr-2 text-[#1EAEDB]" />
                Ambient Study
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleMusicSelect("/music/classical.mp3")}
              >
                <Music4 className="h-4 w-4 mr-2 text-[#1EAEDB]" />
                Classical
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  if (audioElement) {
                    audioElement.pause();
                    setAudioElement(null);
                    setCurrentTrack(null);
                  }
                }}
              >
                <Music className="h-4 w-4 mr-2 text-[#1EAEDB]" />
                Off
              </Button>
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Community Stats Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full bg-transparent hover:bg-blue-50"
          onClick={onToggleCommunityStats}
        >
          <Users className="h-4 w-4 text-[#1EAEDB]" />
        </Button>

        {/* Comments/Review Button with Popover */}
        <div className="relative">
          <Popover open={showCommentsPopover} onOpenChange={setShowCommentsPopover}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-transparent hover:bg-blue-50"
              >
                <MessageCircle className="h-4 w-4 text-[#1EAEDB]" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 bg-white border rounded-lg shadow-lg animate-in fade-in-80 slide-in-from-bottom-5">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Comments</h3>
                <div className="max-h-80 overflow-y-auto space-y-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">John D.</span>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                    <p className="text-sm text-gray-700">This question was really helpful for understanding the concept!</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">Sarah M.</span>
                      <span className="text-xs text-gray-500">1 week ago</span>
                    </div>
                    <p className="text-sm text-gray-700">I think there might be a faster way to solve this problem.</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <textarea 
                    className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Add a comment..."
                    rows={2}
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <Button size="sm" className="bg-[#1EAEDB] hover:bg-[#0FA0CE] text-white">Post</Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Go to Question - Updated to be more clear */}
        <div className="relative">
          <Popover open={showGoToInput} onOpenChange={setShowGoToInput}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full flex items-center bg-transparent hover:bg-blue-50 px-3"
              >
                <span className="text-sm text-[#1EAEDB] mr-2">Go to</span>
                <ArrowRight className="h-4 w-4 text-[#1EAEDB]" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 bg-white border rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-5">
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-gray-700">Go to Question</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    max={totalQuestions}
                    value={targetQuestion}
                    onChange={(e) => setTargetQuestion(e.target.value)}
                    className="w-full"
                    placeholder={`Enter (1-${totalQuestions})`}
                    onKeyPress={(e) => e.key === 'Enter' && handleGoToQuestion()}
                  />
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-[#1EAEDB] hover:bg-[#0FA0CE]"
                    onClick={handleGoToQuestion}
                  >
                    Go
                  </Button>
                </div>
                {inputError && (
                  <div className="text-sm text-red-500">{inputError}</div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Share Button */}
        <div className="relative">
          <Popover open={showShareDialog} onOpenChange={setShowShareDialog}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full bg-transparent hover:bg-blue-50"
              >
                <Share2 className="h-4 w-4 text-[#1EAEDB]" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2 bg-white border rounded-lg shadow-lg animate-in fade-in-80 slide-in-from-bottom-5">
              <div className="text-sm font-medium text-gray-700 p-2">Share Session</div>
              <div className="flex flex-col space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleShare('whatsapp')}
                >
                  <MessageCircle className="h-4 w-4 mr-2 text-[#1EAEDB]" />
                  WhatsApp
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleShare('email')}
                >
                  <Mail className="h-4 w-4 mr-2 text-[#1EAEDB]" />
                  Email
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleShare('copy')}
                >
                  <Share2 className="h-4 w-4 mr-2 text-[#1EAEDB]" />
                  Copy Link
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Bookmark Button */}
        <Button variant="ghost" size="sm" className="rounded-full bg-transparent hover:bg-blue-50">
          <Bookmark className="h-4 w-4 text-[#1EAEDB]" />
        </Button>
      </div>

      {/* Navigation Controls - Right Side */}
      <Button
        variant="ghost"
        className="rounded-full"
        onClick={onNext}
        disabled={currentQuestionIndex >= totalQuestions - 1}
      >
        Next
        <ChevronRight className="h-4 w-4 text-[#1EAEDB] ml-1" />
      </Button>

      {/* Global Animation Styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .fade-in-animation {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default PracticeFooter;
