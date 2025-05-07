
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

export const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
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
        ctx.fillStyle = '#eee';
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
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = `rgba(142, 145, 150, ${opacity * 0.5})`;
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
  
  return (
    <section className="relative py-32 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 bg-[#1A1F2C]"
        style={{ zIndex: -1 }}
      />
      <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="font-cursive md:text-7xl text-white mb-4 text-5xl">Rigorion</h1>
          
          <div className="flex items-center justify-center mb-8">
            <div className="backdrop-blur-sm rounded-full px-5 py-2 flex items-center space-x-2 bg-transparent">
              <span className="font-semibold text-amber-200">#1 Global Ranking</span>
            </div>
          </div>
          
          <Button className="bg-[#8A0303] hover:bg-[#6a0202] text-white font-medium px-8 py-1 rounded-full h-auto text-lg">Join us</Button>
        </div>
      </div>
    </section>
  );
};
