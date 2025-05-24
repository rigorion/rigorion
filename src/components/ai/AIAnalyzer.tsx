
import { useState } from "react";
import { Bot, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAnalyzerProps {
  context?: 'practice' | 'progress';
  data?: any;
}

const AIAnalyzer = ({ context = 'practice', data }: AIAnalyzerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const analyzeWithAI = async (userMessage: string) => {
    setIsLoading(true);
    try {
      // Get DeepSeek API key from localStorage (temporary solution)
      const apiKey = localStorage.getItem('deepseek_api_key');
      if (!apiKey) {
        toast({
          title: "API Key Missing",
          description: "Please enter your DeepSeek API key in the input field first.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      const contextInfo = context === 'practice' 
        ? `You are analyzing practice session data. Current context: ${JSON.stringify(data)}`
        : `You are analyzing progress data. Current context: ${JSON.stringify(data)}`;

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `You are an AI educational analyzer. ${contextInfo}. Provide insightful analysis and suggestions for improvement. Be concise and actionable.`
            },
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      const aiResponse = result.choices[0]?.message?.content || 'No response received';

      // Add both user message and AI response
      const newUserMessage: Message = {
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      };

      const newAIMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newUserMessage, newAIMessage]);
      setInputMessage('');

    } catch (error) {
      console.error('AI Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to get AI analysis",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    analyzeWithAI(inputMessage.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const setApiKey = () => {
    const key = prompt('Enter your DeepSeek API key:');
    if (key) {
      localStorage.setItem('deepseek_api_key', key);
      toast({
        title: "API Key Saved",
        description: "DeepSeek API key has been saved locally.",
        duration: 3000
      });
    }
  };

  return (
    <>
      {/* Floating Bot Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="sm"
        >
          <Bot className="h-5 w-5 text-white" />
        </Button>
      </div>

      {/* AI Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 h-96">
          <Card className="h-full flex flex-col shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bot className="h-4 w-4 text-blue-600" />
                  AI Analyzer
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={setApiKey}
                className="text-xs"
              >
                Set API Key
              </Button>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-3 pt-0">
              {/* Messages Area */}
              <ScrollArea className="flex-1 mb-3">
                <div className="space-y-2">
                  {messages.length === 0 && (
                    <div className="text-center text-sm text-gray-500 mt-4">
                      Ask me to analyze your {context} data!
                    </div>
                  )}
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`text-xs p-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-100 text-blue-900 ml-4'
                          : 'bg-gray-100 text-gray-900 mr-4'
                      }`}
                    >
                      <div className="font-medium mb-1">
                        {message.role === 'user' ? 'You' : 'AI Analyzer'}
                      </div>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <span className="ml-2 text-xs text-gray-500">Analyzing...</span>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask for analysis..."
                  className="text-xs"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  size="sm"
                  className="px-2"
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default AIAnalyzer;
