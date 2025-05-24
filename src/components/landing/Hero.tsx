
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import AISearchBar from "@/components/ui/AISearchBar";

export const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [isAIMode, setIsAIMode] = useState(true);
  
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
    const nodeCount = isAIMode ? 120 : 80;
    const connectionDistance = isAIMode ? 180 : 150;
    
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
        this.size = Math.random() * (isAIMode ? 3 : 2) + 1;
        this.speedX = (Math.random() - 0.5) * (isAIMode ? 0.8 : 0.5);
        this.speedY = (Math.random() - 0.5) * (isAIMode ? 0.8 : 0.5);
        this.pulse = Math.random() * Math.PI * 2;
        this.pulsing = Math.random() > 0.7;
        
        if (isAIMode) {
          // AI Mode: Blue, white, and intelligent colors
          const colorType = Math.random();
          if (colorType < 0.3) {
            this.color = '#3B82F6'; // Blue
          } else if (colorType < 0.6) {
            this.color = '#FFFFFF'; // White
          } else if (colorType < 0.8) {
            this.color = '#8B5CF6'; // Purple
          } else {
            this.color = '#06B6D4'; // Cyan
          }
        } else {
          // Search Mode: Grey and neutral colors
          const colorType = Math.random();
          if (colorType < 0.4) {
            this.color = '#FFFFFF'; // White
          } else if (colorType < 0.8) {
            this.color = '#C8C8C9'; // Light Grey
          } else {
            this.color = '#9CA3AF'; // Medium Grey
          }
        }
      }
      
      update() {
        // Move toward mouse with mode-specific effect
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const attractionForce = isAIMode ? 0.015 : 0.01;
        const attractionRange = isAIMode ? 400 : 300;
        
        if (dist < attractionRange) {
          this.x += dx * attractionForce;
          this.y += dy * attractionForce;
        }
        
        // Regular movement with mode-specific patterns
        if (isAIMode) {
          // AI mode: more dynamic, intelligent-looking movement
          this.pulse += 0.05;
          this.x += this.speedX + Math.sin(this.pulse) * 0.3;
          this.y += this.speedY + Math.cos(this.pulse) * 0.3;
        } else {
          // Search mode: calmer, more structured movement
          this.x += this.speedX;
          this.y += this.speedY;
        }
        
        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      
      draw() {
        if (!ctx) return;
        
        let currentSize = this.size;
        let alpha = 1;
        
        if (isAIMode && this.pulsing) {
          currentSize += Math.sin(this.pulse * 2) * 0.5;
          alpha = 0.8 + Math.sin(this.pulse * 2) * 0.2;
        }
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add glow effect for AI mode
        if (isAIMode && (this.color === '#3B82F6' || this.color === '#8B5CF6')) {
          ctx.shadowBlur = 10;
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
            const opacity = 1 - (distance / connectionDistance);
            
            let connectionColor;
            if (isAIMode) {
              // AI mode: intelligent blue connections
              if (this.color === '#3B82F6' || node.color === '#3B82F6' || 
                  this.color === '#8B5CF6' || node.color === '#8B5CF6') {
                connectionColor = `rgba(59, 130, 246, ${opacity * 0.6})`;
              } else {
                connectionColor = `rgba(139, 92, 246, ${opacity * 0.4})`;
              }
            } else {
              // Search mode: neutral grey connections
              connectionColor = `rgba(156, 163, 175, ${opacity * 0.4})`;
            }
            
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = connectionColor;
            ctx.lineWidth = isAIMode ? 0.8 : 0.5;
            ctx.stroke();
          }
        }
      }
    }
    
    // Initialize nodes
    nodes.length = 0; // Clear existing nodes
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
  }, [isAIMode]); // Re-run animation when mode changes

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleModeChange = (aiMode: boolean) => {
    setIsAIMode(aiMode);
    setAnalysisResult(''); // Clear results when switching modes
  };

  const handleAIAnalyze = async (query: string) => {
    if (!query.trim()) return;
    
    setIsAnalyzing(true);
    setAnalysisResult('');
    
    try {
      // Call DeepSeek API for study plan generation
      const response = await fetch('/api/deepseek-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          context: 'study_plan_generation'
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        setAnalysisResult(result.analysis || 'AI analysis completed successfully!');
      } else {
        setAnalysisResult('Welcome! I\'m here to help you create personalized study plans. Please describe your academic goals, subjects you\'re studying, or areas where you need help, and I\'ll generate a customized learning path for you.');
      }
    } catch (error) {
      console.error('AI Analysis error:', error);
      setAnalysisResult('Welcome to Rigorion! I\'m your AI study companion. Tell me about your learning goals, the subjects you\'re working on, or specific topics you\'d like to master, and I\'ll create a personalized study plan tailored just for you. Let\'s make learning efficient and enjoyable!');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <section className="relative py-32 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className={cn(
          "absolute inset-0 transition-all duration-1000 ease-out",
          isAIMode ? "bg-gradient-to-br from-blue-50 via-white to-purple-50" : "bg-gradient-to-br from-gray-50 via-white to-slate-50"
        )}
        style={{ zIndex: -1 }}
      />
      <div className={cn(
        "absolute inset-0 transition-all duration-1000",
        isAIMode ? "bg-white/20 mix-blend-overlay" : "bg-white/40 mix-blend-overlay"
      )} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-12">
            <AISearchBar
              onSearch={handleSearch}
              onAIAnalyze={handleAIAnalyze}
              onModeChange={handleModeChange}
              placeholder="Tell me about your study goals..."
              className="w-full"
            />
          </div>
          
          {analysisResult && (
            <div className="mb-12 max-w-3xl w-full">
              <div className={cn(
                "backdrop-blur-md rounded-3xl p-8 shadow-2xl border transition-all duration-700 ease-out transform",
                "animate-in slide-in-from-bottom-4 fade-in duration-500",
                isAIMode 
                  ? "bg-white/90 border-blue-200/50 shadow-blue-100/50" 
                  : "bg-white/95 border-gray-200/50"
              )}>
                <div className="flex items-center gap-3 mb-4">
                  {isAIMode ? (
                    <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-full bg-gradient-to-r from-gray-500 to-slate-600">
                      <Search className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <h3 className={cn(
                    "text-xl font-bold",
                    isAIMode ? "text-blue-700" : "text-gray-700"
                  )}>
                    {isAIMode ? "Your AI Study Plan" : "Search Results"}
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-left whitespace-pre-line">{analysisResult}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center mb-8">
            <div className="backdrop-blur-sm rounded-full px-6 py-3 flex items-center space-x-2 bg-white/80 border border-gray-200/50 shadow-lg">
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
