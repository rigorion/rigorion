import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import AISearchBar from "@/components/ui/AISearchBar";
import AnimatedPrompts from "@/components/ui/AnimatedPrompts";
import { analyzeWithDeepSeek } from "@/services/deepseekService";

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
    const nodeCount = 100;
    const connectionDistance = 160;
    
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
        this.size = Math.random() * 2.5 + 1;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = (Math.random() - 0.5) * 0.6;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulsing = Math.random() > 0.7;
        
        // Red/white theme colors
        const colorType = Math.random();
        if (colorType < 0.4) {
          this.color = '#FFFFFF'; // White
        } else if (colorType < 0.7) {
          this.color = '#EF4444'; // Red
        } else if (colorType < 0.9) {
          this.color = '#DC2626'; // Dark Red
        } else {
          this.color = '#8A0303'; // Our brand red
        }
      }
      
      update() {
        // Move toward mouse with attraction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const attractionForce = 0.012;
        const attractionRange = 350;
        
        if (dist < attractionRange) {
          this.x += dx * attractionForce;
          this.y += dy * attractionForce;
        }
        
        // Dynamic movement with pulse
        this.pulse += 0.04;
        this.x += this.speedX + Math.sin(this.pulse) * 0.2;
        this.y += this.speedY + Math.cos(this.pulse) * 0.2;
        
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
        
        if (this.pulsing) {
          currentSize += Math.sin(this.pulse * 2) * 0.4;
          alpha = 0.8 + Math.sin(this.pulse * 2) * 0.2;
        }
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add glow effect for red nodes
        if (this.color === '#EF4444' || this.color === '#8A0303') {
          ctx.shadowBlur = 8;
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
            if (this.color === '#EF4444' || node.color === '#EF4444' || 
                this.color === '#8A0303' || node.color === '#8A0303') {
              connectionColor = `rgba(239, 68, 68, ${opacity * 0.5})`;
            } else {
              connectionColor = `rgba(220, 38, 38, ${opacity * 0.3})`;
            }
            
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = connectionColor;
            ctx.lineWidth = 0.6;
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
      const result = await analyzeWithDeepSeek({
        query: query,
        context: 'study_plan_generation'
      });
      
      setAnalysisResult(result.analysis);
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
        className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-pink-50 transition-all duration-1000 ease-out"
        style={{ zIndex: -1 }}
      />
      <div className="absolute inset-0 bg-white/30 mix-blend-overlay transition-all duration-1000" />
      
      <div className="container mx-auto px-4 relative z-10">
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
          
          {analysisResult && (
            <div className="mb-12 max-w-3xl w-full">
              <div className="backdrop-blur-md rounded-3xl p-8 shadow-2xl border transition-all duration-700 ease-out transform animate-in slide-in-from-bottom-4 fade-in duration-500 bg-white/90 border-red-200/50 shadow-red-100/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-gradient-to-r from-[#8A0303] to-red-600">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-red-700">Your AI Study Plan</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-left whitespace-pre-line">{analysisResult}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center mb-8">
            <div className="backdrop-blur-sm rounded-full px-6 py-3 flex items-center space-x-2 bg-white/80 border border-red-200/50 shadow-lg">
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
