
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import AISearchBar from "@/components/ui/AISearchBar";
import AnimatedPrompts from "@/components/ui/AnimatedPrompts";
import { analyzeWithAIML } from "@/services/aimlApi";

export const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Network nodes
    const nodes: Node[] = [];
    const nodeCount = 80;
    const connectionDistance = 150;
    
    // Mouse position
    let mouseX = 0;
    let mouseY = 0;
    
    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Create nodes
    class Node {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      pulse: number;
      pulsing: boolean;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulsing = Math.random() > 0.8;
        
        // Subtle gray/blue theme colors for white background
        const colorType = Math.random();
        if (colorType < 0.4) {
          this.color = '#E5E7EB'; // Light gray
        } else if (colorType < 0.7) {
          this.color = '#9CA3AF'; // Medium gray
        } else if (colorType < 0.9) {
          this.color = '#6B7280'; // Dark gray
        } else {
          this.color = '#8A0303'; // Brand red accent
        }
      }
      
      update() {
        // Move toward mouse with attraction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const attractionForce = 0.008;
        const attractionRange = 300;
        
        if (dist < attractionRange) {
          this.x += dx * attractionForce;
          this.y += dy * attractionForce;
        }
        
        // Dynamic movement with pulse
        this.pulse += 0.03;
        this.x += this.speedX + Math.sin(this.pulse) * 0.1;
        this.y += this.speedY + Math.cos(this.pulse) * 0.1;
        
        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      
      draw() {
        if (!ctx) return;
        
        let currentSize = this.size;
        let alpha = 0.6;
        
        if (this.pulsing) {
          currentSize += Math.sin(this.pulse * 2) * 0.3;
          alpha = 0.4 + Math.sin(this.pulse * 2) * 0.2;
        }
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add subtle glow effect for red nodes
        if (this.color === '#8A0303') {
          ctx.shadowBlur = 6;
          ctx.shadowColor = this.color;
          ctx.fill();
        }
        
        ctx.restore();
      }
      
      connect() {
        if (!ctx) return;
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const dx = this.x - node.x;
          const dy = this.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionDistance) {
            const opacity = (1 - (distance / connectionDistance)) * 0.2;
            
            let connectionColor = `rgba(156, 163, 175, ${opacity})`;
            if (this.color === '#8A0303' || node.color === '#8A0303') {
              connectionColor = `rgba(138, 3, 3, ${opacity * 1.5})`;
            }
            
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = connectionColor;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }
    
    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node());
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update();
        nodes[i].draw();
      }
      
      // Connect nodes
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].connect();
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
    <section className="relative py-32 overflow-hidden bg-white">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 bg-white"
        style={{ zIndex: 1 }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-white/50 to-blue-50/30 mix-blend-overlay" style={{ zIndex: 2 }} />
      
      <div className="container mx-auto px-4 relative" style={{ zIndex: 10 }}>
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-8">
            <AISearchBar
              onAIAnalyze={handleAIAnalyze}
              placeholder="Tell me about your study goals..."
              className="w-full"
            />
          </div>
          
          {!analysisResult && !isAnalyzing && (
            <AnimatedPrompts />
          )}
          
          {isAnalyzing && (
            <div className="mb-12 max-w-3xl w-full">
              <div className="backdrop-blur-sm rounded-3xl p-8 shadow-xl border bg-white/90 border-gray-200">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                  <span className="text-gray-600">AI is analyzing your request...</span>
                </div>
              </div>
            </div>
          )}
          
          {analysisResult && (
            <div className="mb-12 max-w-3xl w-full">
              <div className="backdrop-blur-sm rounded-3xl p-8 shadow-xl border transition-all duration-700 ease-out transform animate-in slide-in-from-bottom-4 fade-in duration-500 bg-white/95 border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-gradient-to-r from-[#8A0303] to-red-600">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-red-700">Your AI Study Plan</h3>
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
          
          <div className="flex items-center justify-center mb-8">
            <div className="backdrop-blur-sm rounded-full px-6 py-3 flex items-center space-x-2 bg-white/90 border border-gray-200 shadow-lg">
              <span className="font-semibold text-[#8A0303]">#1 Global Ranking</span>
            </div>
          </div>
          
          <Button className="bg-[#8A0303] hover:bg-[#6a0202] text-white font-medium px-8 py-4 rounded-full h-auto text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            {isAnalyzing ? 'Analyzing...' : 'Join us'}
          </Button>
        </div>
      </div>
    </section>
  );
};
