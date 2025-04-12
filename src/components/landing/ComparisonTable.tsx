
import React from 'react';
import { Check, X } from 'lucide-react';

type FeatureType = {
  name: string;
  competitors: {
    rigorion: boolean;
    canvasa: boolean;
    mojule: boolean;
    techmarin: boolean;
    spencecraft: boolean;
    coachseye: boolean;
  };
};

const FEATURES: FeatureType[] = [
  {
    name: "Cost",
    competitors: {
      rigorion: true,
      canvasa: true,
      mojule: true,
      techmarin: true,
      spencecraft: true,
      coachseye: true
    }
  },
  {
    name: "Content Quality",
    competitors: {
      rigorion: true,
      canvasa: false,
      mojule: false,
      techmarin: true,
      spencecraft: false,
      coachseye: true
    }
  },
  {
    name: "Adaptive Learning",
    competitors: {
      rigorion: true,
      canvasa: true,
      mojule: false,
      techmarin: false,
      spencecraft: false,
      coachseye: true
    }
  },
  {
    name: "Mock Test Realism",
    competitors: {
      rigorion: true,
      canvasa: true,
      mojule: true,
      techmarin: false,
      spencecraft: false,
      coachseye: true
    }
  },
  {
    name: "Performance Analytics",
    competitors: {
      rigorion: true,
      canvasa: false,
      mojule: true,
      techmarin: true,
      spencecraft: false,
      coachseye: true
    }
  },
  {
    name: "Official Test Content",
    competitors: {
      rigorion: false,
      canvasa: true,
      mojule: false,
      techmarin: false,
      spencecraft: true,
      coachseye: false
    }
  },
  {
    name: "Gamification",
    competitors: {
      rigorion: false,
      canvasa: true,
      mojule: true,
      techmarin: true,
      spencecraft: false,
      coachseye: true
    }
  },
  {
    name: "Differntiating Feature #1",
    competitors: {
      rigorion: true,
      canvasa: false,
      mojule: true,
      techmarin: true,
      spencecraft: false,
      coachseye: true
    }
  },
  {
    name: "Differntiating Feature #2",
    competitors: {
      rigorion: false,
      canvasa: false,
      mojule: false,
      techmarin: false,
      spencecraft: false,
      coachseye: false
    }
  }
];

const COMPETITORS = [
  { id: "rigorion", name: "Rigorion", color: "#0072BB" },
  { id: "scoresmart", name: "ScoreSmart", color: "#38B04A" },
  { id: "magoosh", name: "Magoosh", color: "#046C76" },
  { id: "edisonos", name: "Edisonos", color: "#D93232" },
  { id: "testinnovators", name: "TestInnovators", color: "#FFA734" },
  { id: "princetonreview", name: "PrincetonReview", color: "#0072BB" }
];

export const ComparisonTable = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-14">Product Comparison Chart</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left font-medium text-gray-500 border-b"></th>
                {COMPETITORS.map((competitor) => (
                  <th 
                    key={competitor.id}
                    className="p-4 text-center font-bold text-white border-b"
                    style={{ backgroundColor: competitor.color }}
                  >
                    {competitor.name}
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {FEATURES.map((feature, idx) => (
                <tr 
                  key={feature.name}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="p-4 font-medium text-gray-700">{feature.name}</td>
                  {COMPETITORS.map((competitor) => {
                    const hasFeature = feature.competitors[competitor.id as keyof typeof feature.competitors];
                    
                    return (
                      <td 
                        key={`${feature.name}-${competitor.id}`} 
                        className="p-4 text-center"
                      >
                        {hasFeature ? (
                          <Check size={18} className="mx-auto" style={{ color: competitor.color }} />
                        ) : (
                          <X size={18} className="mx-auto text-gray-300" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
