
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, Link, Mail, MessageCircle, Music, Music2, Music4, Share2, Users } from "lucide-react";

interface PracticeFooterProps {
  onToggleCommunityStats: () => void;
}

const PracticeFooter = ({ onToggleCommunityStats }: PracticeFooterProps) => {
  const [isMusicMenuOpen, setIsMusicMenuOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);

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
    <div className="border-t px-6 py-4 flex items-center justify-between bg-gray-50">
      <div className="flex items-center gap-2">
        {/* Music Menu Button */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            onClick={() => setIsMusicMenuOpen(!isMusicMenuOpen)}
          >
            <Music className="h-4 w-4" />
            {currentTrack ? "Playing" : "Music"}
          </Button>
          {isMusicMenuOpen && (
            <div className="absolute bottom-full mb-2 left-0 bg-white border rounded-lg shadow-lg p-2 w-48">
              <div className="text-sm text-gray-700 px-3 py-1">Background Music</div>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleMusicSelect("/music/ambient.mp3")}
              >
                <Music2 className="h-4 w-4 mr-2" />
                Ambient Study
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleMusicSelect("/music/classical.mp3")}
              >
                <Music4 className="h-4 w-4 mr-2" />
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
                <Music className="h-4 w-4 mr-2" />
                Off
              </Button>
            </div>
          )}
        </div>
        {/* Community Stats Toggle Button next to Music Button */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            onClick={onToggleCommunityStats}
          >
            <Users className="h-4 w-4" />
            Stats
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-full relative"
          onClick={() => setShowShareDialog(!showShareDialog)}
        >
          <Share2 className="h-4 w-4" />
          {showShareDialog && (
            <div className="absolute bottom-full left-0 mb-2 bg-white border rounded-lg shadow-lg p-2 w-48">
              <div className="text-sm font-medium text-gray-700 p-2">Share Practice Session</div>
              <div className="flex flex-col space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleShare('whatsapp')}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleShare('email')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleShare('copy')}
                >
                  <Link className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>
          )}
        </Button>
        <Button variant="ghost" size="sm" className="rounded-full">
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PracticeFooter;
