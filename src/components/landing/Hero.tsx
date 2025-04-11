import React from 'react';
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
export const Hero = () => {
  return <section className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img src="/lovable-uploads/cd57f5b5-61c8-44ec-a6f5-22d2a8296a14.png" alt="Colorful intellectual background" className="w-full h-full object-cover mix-blend-overlay" />
      </div>
      <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="font-cursive md:text-7xl text-white mb-4 text-5xl">Rigorion</h1>
          
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-5 py-2 flex items-center space-x-2">
              <Award className="text-[#8A0303] h-5 w-5" />
              <span className="text-[#8A0303] font-semibold">#1 Global Ranking</span>
            </div>
          </div>
          
          <Button className="bg-[#8A0303] hover:bg-[#6a0202] text-white font-medium px-8 py-1 rounded-md h-auto text-lg">
            Take it Now
          </Button>
        </div>
      </div>
    </section>;
};