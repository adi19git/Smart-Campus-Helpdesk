import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const StarRating = ({ rating, onRate, readonly = false, size = 'md' }) => {
  const [hovered, setHovered] = useState(0);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  if (readonly && rating) {
    return (
      <div className="flex items-center justify-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-100/50 dark:border-amber-500/20 w-max shadow-sm">
        <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{rating}.0</span>
        <Star className="w-4 h-4 text-amber-500 fill-amber-500 drop-shadow-sm" />
      </div>
    );
  }

  if (readonly) {
    return <span className="text-slate-300 dark:text-slate-600 font-medium text-xs">—</span>;
  }

  return (
    <div className="flex justify-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onRate && onRate(star)}
          className="transition-colors p-0.5"
        >
          <Star
            className={`${sizes[size]} transition-colors ${
              star <= (hovered || rating)
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-300 dark:text-slate-600'
            }`}
          />
        </motion.button>
      ))}
    </div>
  );
};

export default StarRating;
