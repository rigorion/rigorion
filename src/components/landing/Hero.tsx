import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';
import AISearchBar from "@/components/ui/AISearchBar";
import AnimatedPrompts from "@/components/ui/AnimatedPrompts";
import TypingAnimation from "@/components/ui/TypingAnimation";
import { analyzeWithAIML } from "@/services/aimlApi";

export const Hero = () => {
  const [analysisResult, setAnalysisResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAIAnalyze = async (query: string) => {
    if (!query.trim()) return;
    
    setIsAnalyzing(true);
    setAnalysisResult('');
    
    try {
      const systemPrompt = `You are an expert educational AI assistant specialized in creating personalized study plans for students. Your role is to:

1. Analyze the student's goals, subjects, and available time
2. Create structured, actionable study plans with specific timelines
3. Provide learning strategies tailored to different subjects (SAT, ACT, AP courses, etc.)
4. Suggest effective study techniques and resources
5. Help students balance multiple subjects and extracurricular activities

Always respond with practical, encouraging advice formatted in a clear, organized manner. Include specific recommendations for daily/weekly schedules when appropriate.`;

      const result = await analyzeWithAIML({ 
        query: `${systemPrompt}\n\nStudent Query: ${query}` 
      });
      
      setAnalysisResult(result);
    } catch (error) {
      console.error('AI Analysis error:', error);
      setAnalysisResult('Welcome to Rigorion! I\'m your AI study companion. Tell me about your learning goals, the subjects you\'re working on, or specific topics you\'d like to master, and I\'ll create a personalized study plan tailored just for you. Let\'s make learning efficient and enjoyable!');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <section 
      className="relative py-32 bg-gradient-to-br from-gray-50 to-blue-50"
      style={{
        backgroundImage: `url('/lovable-uploads/corner-building-for-4k-white-background-tsx7c82luhg36ygy.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Optional overlay for better text readability */}
      <div className="absolute inset-0 bg-white/70"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Search bar */}
          <div className="mb-8 w-full max-w-2xl">
            <AISearchBar
              onAIAnalyze={handleAIAnalyze}
              placeholder="Tell me about your study goals..."
              className="w-full max-w-none"
            />
          </div>
          
          {!analysisResult && !isAnalyzing && (
            <AnimatedPrompts />
          )}
          
          {isAnalyzing && (
            <div className="mb-12 max-w-3xl w-full">
              <div className="p-6">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#8A0303]"></div>
                  <span className="text-gray-600">AI is analyzing your request...</span>
                </div>
              </div>
            </div>
          )}
          
          {analysisResult && (
            <div className="mb-12 max-w-3xl w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-[#8A0303]">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Your AI Study Plan</h3>
                </div>
                <TypingAnimation 
                  text={analysisResult}
                  speed={20}
                  className="text-gray-700 leading-relaxed text-left whitespace-pre-line"
                />
                <div className="mt-4 pt-4">
                  <Button
                    onClick={() => setAnalysisResult('')}
                    className="bg-white hover:bg-gray-50 text-[#8A0303] border border-[#8A0303] hover:border-[#6b0202] rounded-full px-4 py-2"
                  >
                    Clear Analysis
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Action button */}
          <div className="flex items-center justify-center mb-8">
            <Button className="bg-white hover:bg-gray-50 text-[#8A0303] border border-[#8A0303] font-medium px-8 py-3 rounded-full shadow-sm">
              {isAnalyzing ? 'Analyzing...' : 'Join us'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
