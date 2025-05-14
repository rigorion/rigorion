
import React from 'react';

interface DifficultyStatsGridProps {
  stats: {
    easy: number;
    medium: number;
    hard: number;
    total: number;
  }
}

export const DifficultyStatsGrid: React.FC<DifficultyStatsGridProps> = ({ stats }) => {
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
