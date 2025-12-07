import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StarRatingProps {
  rating: number; // 0-5
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  onRatingChange,
  readOnly = false,
  size = 'md',
  className
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleMouseEnter = (index: number) => {
    if (!readOnly) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(null);
    }
  };

  const handleClick = (index: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(index);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxRating }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = (hoverRating !== null ? starValue <= hoverRating : starValue <= rating);
        
        return (
          <button
            key={i}
            type="button"
            className={cn(
              "transition-colors duration-200 focus:outline-none",
              readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
            )}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            disabled={readOnly}
            title={`Noter ${starValue} sur ${maxRating}`}
          >
            <Star
              className={cn(
                starSizes[size],
                isFilled 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "text-gray-300 dark:text-gray-600"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
