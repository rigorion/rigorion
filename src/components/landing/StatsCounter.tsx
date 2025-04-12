
import React from 'react';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Users, CheckSquare, Clock, Award } from 'lucide-react';

type StatType = {
  id: string;
  value: number;
  label: string;
  icon: React.ReactNode;
};

const STATS: StatType[] = [
  {
    id: "students",
    value: 288,
    label: "Our Students",
    icon: <Users className="w-6 h-6 text-white" />
  },
  {
    id: "problems",
    value: 158,
    label: "Solved Problems",
    icon: <CheckSquare className="w-6 h-6 text-white" />
  },
  {
    id: "time",
    value: 98,
    label: "Total Time Invested",
    icon: <Clock className="w-6 h-6 text-white" />
  },
  {
    id: "passed",
    value: 34,
    label: "AWARDS",
    icon: <Award className="w-6 h-6 text-white" />
  }
];

export const StatsCounter = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    students: 0,
    problems: 0,
    time: 0,
    passed: 0
  });
  
  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setCounts(prevCounts => {
          const newCounts = { ...prevCounts };
          let allCompleted = true;
          
          STATS.forEach(stat => {
            if (newCounts[stat.id] < stat.value) {
              // Calculate increment to make animation smoother for larger numbers
              const increment = Math.max(1, Math.ceil(stat.value / 50));
              newCounts[stat.id] = Math.min(stat.value, newCounts[stat.id] + increment);
              allCompleted = false;
            }
          });
          
          if (allCompleted) {
            clearInterval(interval);
          }
          
          return newCounts;
        });
      }, 30);
      
      return () => clearInterval(interval);
    }
  }, [isInView]);

  return (
    <section 
      ref={ref}
      className="py-24 bg-gray-900 bg-opacity-80 relative"
      style={{
        backgroundImage: 'url(https://cdn.pixabay.com/photo/2016/10/03/22/47/robot-arm-1713081_1280.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-2 border-white border-opacity-20 mb-4 mx-auto">
                <div className="text-2xl md:text-4xl font-bold text-white">{counts[stat.id]}</div>
              </div>
              <p className="text-sm text-white font-medium tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
