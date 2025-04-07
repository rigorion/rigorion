import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'available' | 'coming-soon';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  return (
    <div
      className={cn(
        'px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5',
        status === 'available' ? 'bg-blue-light text-blue-dark' : 'bg-amber-light text-amber-dark',
        className
      )}
    >
      <span className={cn(
        'w-2 h-2 rounded-full',
        status === 'available' ? 'bg-blue animate-pulse-subtle' : 'bg-amber'
      )} />
      {status === 'available' ? 'Available' : 'Coming Soon'}
    </div>
  );
};

export default StatusBadge;
