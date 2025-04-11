
import React from 'react';
import { Check, X } from 'lucide-react';

type FeatureType = {
  name: string;
  competitors: {
    knewt: boolean;
    canvasa: boolean;
    mojule: boolean;
    techmarin: boolean;
    spencecraft: boolean;
    coachseye: boolean;
  };
};

const FEATURES: FeatureType[] = [
  {
    name: "Platform",
    competitors: {
      knewt: true,
      canvasa: true,
      mojule: true,
      techmarin: true,
      spencecraft: true,
      coachseye: true
    }
  },
  {
    name: "Capture Images",
    competitors: {
      knewt: true,
      canvasa: false,
      mojule: false,
      techmarin: true,
      spencecraft: false,
      coachseye: true
    }
  },
  {
    name: "Edit Images",
    competitors: {
      knewt: true,
      canvasa: true,
      mojule: false,
      techmarin: false,
      spencecraft: false,
      coachseye: true
    }
  },
  {
    name: "Record Video",
    competitors: {
      knewt: true,
      canvasa: true,
      mojule: true,
      techmarin: false,
      spencecraft: false,
      coachseye: true
    }
  },
  {
    name: "Edit Video",
    competitors: {
      knewt: true,
      canvasa: false,
      mojule: true,
      techmarin: true,
      spencecraft: false,
      coachseye: true
    }
  },
  {
    name: "Media Hosting",
    competitors: {
      knewt: false,
      canvasa: true,
      mojule: false,
      techmarin: false,
      spencecraft: true,
      coachseye: false
    }
  },
  {
    name: "Sharing",
    competitors: {
      knewt: false,
      canvasa: true,
      mojule: true,
      techmarin: true,
      spencecraft: false,
      coachseye: true
    }
  },
  {
    name: "Import Media with Technical Data",
    competitors: {
      knewt: true,
      canvasa: false,
      mojule: true,
      techmarin: true,
      spencecraft: false,
      coachseye: true
    }
  },
  {
    name: "Learning",
    competitors: {
      knewt: false,
      canvasa: false,
      mojule: false,
      techmarin: false,
      spencecraft: false,
      coachseye: false
    }
  }
];

const COMPETITORS = [
  { id: "knewt", name: "KNEWT", color: "#0072BB" },
  { id: "canvasa", name: "CANVASA", color: "#38B04A" },
  { id: "mojule", name: "MOJULE", color: "#046C76" },
  { id: "techmarin", name: "TECHMARIN RELAY", color: "#D93232" },
  { id: "spencecraft", name: "SPENCECRAFT", color: "#FFA734" },
  { id: "coachseye", name: "COACH'S EYE", color: "#0072BB" }
];

export const ComparisonTable = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-14">Module Comparison</h2>
        
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
