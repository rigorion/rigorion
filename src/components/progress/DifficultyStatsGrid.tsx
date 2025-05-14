
import React from 'react';

interface DifficultyStatsGridProps {
  stats: {
    easy: number;
    medium: number;
    hard: number;
    total: number;
  } | Array<{
    title: string;
    correct: number;
    total: number;
    avgTime: string;
    color: string;
  }>;
}

export const DifficultyStatsGrid: React.FC<DifficultyStatsGridProps> = ({ stats }) => {
  // Check if we're dealing with the array format or the object format
  if (Array.isArray(stats)) {
    return (
      <div className="grid grid-cols-3 gap-4 w-full">
        {stats.map((item, index) => (
          <div key={index} className={`${item.color} p-4 rounded-lg`}>
            <h4 className="text-sm font-medium mb-1">
              {item.title}
            </h4>
            <p className="text-2xl font-bold">{item.correct}</p>
            <p className="text-xs">
              {item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0}% of total
            </p>
            <p className="text-xs mt-1">Avg. time: {item.avgTime}</p>
          </div>
        ))}
      </div>
    );
  }
  
  // Original format
  const calculatePercentage = (value: number) => {
    return stats.total > 0 ? Math.round((value / stats.total) * 100) : 0;
  };

  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="text-green-700 text-sm font-medium mb-1">Easy</h4>
        <p className="text-2xl font-bold text-green-600">{stats.easy}</p>
        <p className="text-xs text-green-600">{calculatePercentage(stats.easy)}% of total</p>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="text-yellow-700 text-sm font-medium mb-1">Medium</h4>
        <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
        <p className="text-xs text-yellow-600">{calculatePercentage(stats.medium)}% of total</p>
      </div>
      
      <div className="bg-red-50 p-4 rounded-lg">
        <h4 className="text-red-700 text-sm font-medium mb-1">Hard</h4>
        <p className="text-2xl font-bold text-red-600">{stats.hard}</p>
        <p className="text-xs text-red-600">{calculatePercentage(stats.hard)}% of total</p>
      </div>
    </div>
  );
};
