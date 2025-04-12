
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Bookmark, ChevronLeft, ChevronRight, ArrowRight, 
  Mail, MessageCircle, Music, Music2, Music4, 
  Share2, Users, Star, Clock
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
  const [showCommunityStats, setShowCommunityStats] = useState(false);

  // Community stats data
  const communityStats = {
    totalAttempts: 2450,
    accuracy: 68,
    avgTime: "2m 15s",
    difficultyRating: {
      easy: 45,
      medium: 35,
      hard: 20
    }
  };

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

  const toggleCommunityStats = () => {
    setShowCommunityStats(!showCommunityStats);
    onToggleCommunityStats();
  };

  useEffect(() => {
    // Clean up audio on component unmount
    return () => {
      if (audioElement) {
        audioElement.pause();
        setAudioElement(null);
      }
    };
  }, []);

  return (
    <div className="border-t px-6 py-4 flex flex-col bg-gray-50">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side - Previous Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={onPrevious}
            disabled={currentQuestionIndex <= 0}
          >
            <ChevronLeft className="h-4 w-4 text-blue-600 mr-1" />
            Previous
          </Button>
          
          {/* Community Stats Toggle Button */}
          <Popover open={showCommunityStats} onOpenChange={toggleCommunityStats}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full bg-transparent hover:bg-blue-50 flex items-center"
              >
                <Users className="h-4 w-4 text-blue-600" />
                {showCommunityStats && (
                  <span className="ml-2 text-sm">Stats</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">{communityStats.totalAttempts}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">{communityStats.accuracy}%</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{communityStats.avgTime}</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Center Section with Features */}
        <div className="flex items-center gap-3 justify-center">
          {/* Music Menu Button */}
          <Popover open={isMusicMenuOpen} onOpenChange={setIsMusicMenuOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-transparent hover:bg-blue-50"
              >
                <Music className="h-4 w-4 text-blue-600" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2 bg-white border rounded-lg shadow-lg animate-in fade-in-80 slide-in-from-bottom-5">
              <div className="text-sm text-gray-700 px-3 py-1">Background Music</div>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleMusicSelect("/music/ambient.mp3")}
              >
                <Music2 className="h-4 w-4 mr-2 text-blue-600" />
                Ambient Study
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleMusicSelect("/music/classical.mp3")}
              >
                <Music4 className="h-4 w-4 mr-2 text-blue-600" />
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
                <Music className="h-4 w-4 mr-2 text-blue-600" />
                Off
              </Button>
            </PopoverContent>
          </Popover>
          
          {/* Comments/Review Button with Popover */}
          <Popover open={showCommentsPopover} onOpenChange={setShowCommentsPopover}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-transparent hover:bg-blue-50"
              >
                <MessageCircle className="h-4 w-4 text-blue-600" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 bg-white border rounded-lg shadow-lg animate-in fade-in-80 slide-in-from-bottom-5">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Reviews</h3>
                <div className="max-h-80 overflow-y-auto space-y-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">John D.</span>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                    <p className="text-sm text-gray-700">This question was really helpful for understanding the concept!</p>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Go to Question Button */}
          <Popover open={showGoToInput} onOpenChange={setShowGoToInput}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full flex items-center bg-transparent hover:bg-blue-50 px-3"
              >
                <span className="text-sm text-blue-600 mr-2">Go to</span>
                <ArrowRight className="h-4 w-4 text-blue-600" />
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
                    className="bg-blue-600 hover:bg-blue-700"
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

          {/* Share Button */}
          <Popover open={showShareDialog} onOpenChange={setShowShareDialog}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full bg-transparent hover:bg-blue-50"
              >
                <Share2 className="h-4 w-4 text-blue-600" />
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
                  <MessageCircle className="h-4 w-4 mr-2 text-blue-600" />
                  WhatsApp
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleShare('email')}
                >
                  <Mail className="h-4 w-4 mr-2 text-blue-600" />
                  Email
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleShare('copy')}
                >
                  <Share2 className="h-4 w-4 mr-2 text-blue-600" />
                  Copy Link
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Bookmark Button */}
          <Button variant="ghost" size="sm" className="rounded-full bg-transparent hover:bg-blue-50">
            <Bookmark className="h-4 w-4 text-blue-600" />
          </Button>
        </div>

        {/* Right Side - Next Button */}
        <Button
          variant="ghost"
          className="rounded-full"
          onClick={onNext}
          disabled={currentQuestionIndex >= totalQuestions - 1}
        >
          Next
          <ChevronRight className="h-4 w-4 text-blue-600 ml-1" />
        </Button>
      </div>

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
