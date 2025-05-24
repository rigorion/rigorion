import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import AISearchBar from "@/components/ui/AISearchBar";

export const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  
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
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        
        // Randomly assign white, grey or gold color
        const colorType = Math.random();
        if (colorType < 0.4) {
          this.color = '#FFFFFF'; // White
        } else if (colorType < 0.8) {
          this.color = '#C8C8C9'; // Light Grey
        } else {
          this.color = '#FEF7CD'; // Soft gold
        }
      }
      
      update() {
        // Move slightly toward mouse with subtle effect
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 300) {
          this.x += dx * 0.01;
          this.y += dy * 0.01;
        }
        
        // Regular movement
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      
      connect() {
        if (!ctx) return;
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const dx = this.x - node.x;
          const dy = this.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionDistance) {
            // Calculate opacity based on distance
            const opacity = 1 - (distance / connectionDistance);
            
            // Create gold-tinged connections
            let connectionColor;
            if (this.color === '#FEF7CD' || node.color === '#FEF7CD') {
              // If either node is gold, make connection gold
              connectionColor = `rgba(254, 247, 205, ${opacity * 0.7})`;
            } else {
              // Otherwise make it grey
              connectionColor = `rgba(200, 200, 201, ${opacity * 0.5})`;
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
        className="absolute inset-0 bg-[#f9f9f9]"
        style={{ zIndex: -1 }}
      />
      <div className="absolute inset-0 bg-white/40 mix-blend-overlay" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-8">
            <AISearchBar
              onSearch={handleSearch}
              onAIAnalyze={handleAIAnalyze}
              placeholder="Tell me about your study goals..."
              className="w-full max-w-2xl"
            />
          </div>
          
          {analysisResult && (
            <div className="mb-8 max-w-2xl">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-[#333333] mb-3">Your AI Study Plan</h3>
                <p className="text-gray-700 leading-relaxed">{analysisResult}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center mb-8">
            <div className="backdrop-blur-sm rounded-full px-5 py-2 flex items-center space-x-2 bg-transparent">
              <span className="font-semibold text-[#8A0303]">#1 Global Ranking</span>
            </div>
          </div>
          
          <Button className="bg-[#8A0303] hover:bg-[#6a0202] text-white font-medium px-8 py-1 rounded-full h-auto text-lg">
            {isAnalyzing ? 'Analyzing...' : 'Join us'}
          </Button>
        </div>
      </div>
    </section>
  );
};
