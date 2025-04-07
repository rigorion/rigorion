import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
  size?: number;
  showNumber?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 7,
  className,
  size = 20,
  showNumber = true
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  // Animation variants
  const starVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: i * 0.05 }
    }),
    hover: { scale: 1.2, transition: { type: 'spring', stiffness: 300 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center gap-3 p-3 rounded-2xl',
        'bg-gradient-to-br from-amber-50/20 to-amber-100/30',
        'border border-amber-100/50 backdrop-blur-sm',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {Array.from({ length: fullStars }).map((_, i) => (
          <motion.div
            key={`full-${i}`}
            variants={starVariants}
            initial="hidden"
            animate="visible"
            custom={i}
            whileHover="hover"
          >
            <Star
              className="drop-shadow-gold"
              size={size}
              style={{
                fill: 'url(#goldGradient)',
                stroke: 'url(#goldGradient)'
              }}
            />
          </motion.div>
        ))}

        {hasHalfStar && (
          <motion.div
            key="half-star"
            variants={starVariants}
            initial="hidden"
            animate="visible"
            custom={fullStars}
            whileHover="hover"
          >
            <StarHalf
              className="drop-shadow-gold"
              size={size}
              style={{
                fill: 'url(#goldGradient)',
                stroke: 'url(#goldGradient)'
              }}
            />
          </motion.div>
        )}

        {Array.from({ length: emptyStars }).map((_, i) => (
          <motion.div
            key={`empty-${i}`}
            variants={starVariants}
            initial="hidden"
            animate="visible"
            custom={fullStars + (hasHalfStar ? 1 : 0) + i}
            whileHover="hover"
          >
            <Star
              size={size}
              className="text-amber-100/30 stroke-amber-200/30"
            />
          </motion.div>
        ))}
      </div>

      {showNumber && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1.5"
        >
          <span className="text-lg font-semibold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
            {rating.toFixed(1)}
          </span>
          <span className="text-xs text-amber-600/80">/ {maxRating}</span>
        </motion.div>
      )}

      {/* SVG Gradient definition */}
      <svg className="absolute w-0 h-0">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#DAA520', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#B8860B', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};



export default StarRating;