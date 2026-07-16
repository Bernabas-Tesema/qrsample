import { Star } from 'lucide-react';
import { cn } from '@/utils';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md';
  showValue?: boolean;
}

export function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 'md',
  showValue = false,
}: StarRatingProps) {
  const iconClass = size === 'sm' ? 'h-4 w-4' : 'h-6 w-6';

  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly || !onChange}
            onClick={() => onChange?.(star)}
            className={cn(
              'transition-transform',
              !readOnly && onChange && 'hover:scale-110 cursor-pointer',
              (readOnly || !onChange) && 'cursor-default'
            )}
            aria-label={`${star} star`}
          >
            <Star
              className={cn(
                iconClass,
                filled ? 'fill-primary text-primary' : 'text-gray-300'
              )}
            />
          </button>
        );
      })}
      {showValue && value > 0 && (
        <span className="ml-1 text-sm font-medium text-text-secondary">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
