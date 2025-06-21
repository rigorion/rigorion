import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';
import AISearchBar from "@/components/ui/AISearchBar";
import AnimatedPrompts from "@/components/ui/AnimatedPrompts";
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
    <section className="relative py-32 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
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
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">AI is analyzing your request...</span>
                </div>
              </div>
            </div>
          )}
          
          {analysisResult && (
            <div className="mb-12 max-w-3xl w-full">
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-blue-600">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Your AI Study Plan</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-left whitespace-pre-line">{analysisResult}</p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAnalysisResult('')}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Clear Analysis
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="bg-white rounded-full px-6 py-3 border border-gray-200 shadow-sm">
              <span className="font-medium text-blue-600">#1 Global Ranking</span>
            </div>
            
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-full">
              {isAnalyzing ? 'Analyzing...' : 'Join us'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
