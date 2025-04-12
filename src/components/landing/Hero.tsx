import React from 'react';
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
export const Hero = () => {
  return <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img src="/lovable-uploads/grad.png" alt="Colorful intellectual background" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="font-cursive md:text-7xl text-white mb-4 text-5xl">Rigorion</h1>
          
          <div className="flex items-center justify-center mb-8">
            <div className="backdrop-blur-sm rounded-full px-5 py-2 flex items-center space-x-2 bg-transparent">
              
              <span className="font-semibold text-amber-200">#1 Global Ranking</span>
            </div>
          </div>
          
          <Button className="bg-[#8A0303] hover:bg-[#6a0202] text-white font-medium px-8 py-1 rounded-full h-auto text-lg">Join us </Button>
        </div>
      </div>
    </section>;
};