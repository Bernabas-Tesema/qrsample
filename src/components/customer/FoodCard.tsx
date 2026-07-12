import { Link } from 'react-router-dom';
import { useState } from 'react';
import { cn, formatPrice, parseIngredients } from '@/utils';
import {
  resolveMenuItemImage,
} from '@/data/menu-images';
import {
  getMenuItemImageByName,
  CATEGORY_ID_TO_NAME,
  CATEGORY_IMAGES,
  PLACEHOLDER_IMAGE,
} from '@/data/item-images';
import type { MenuItem } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { useRestaurant } from '@/contexts/RestaurantContext';

interface FoodCardProps {
  item: MenuItem;
  className?: string;
  style?: React.CSSProperties;
}

function getFallbackChain(name: string, categoryId: string, attempt: number): string {
  if (attempt === 0) return getMenuItemImageByName(name) || resolveMenuItemImage(name, categoryId, null);
  const cat = CATEGORY_ID_TO_NAME[categoryId];
  if (attempt === 1 && cat && CATEGORY_IMAGES[cat]) return CATEGORY_IMAGES[cat];
  return PLACEHOLDER_IMAGE;
}

export function FoodCard({ item, className, style }: FoodCardProps) {
  const { slug } = useRestaurant();
  const isUnavailable = item.availability === 'unavailable';
  const ingredients = parseIngredients(item.description);
  const preview = ingredients.slice(0, 3).join(', ');
  const [imgSrc, setImgSrc] = useState(() =>
    resolveMenuItemImage(item.name, item.category_id, item.image)
  );
  const [fallbackAttempt, setFallbackAttempt] = useState(0);

  const handleImgError = () => {
    const next = fallbackAttempt + 1;
    setFallbackAttempt(next);
    setImgSrc(getFallbackChain(item.name, item.category_id, next));
  };

  return (
    <Link
      to={`/r/${slug}/item/${item.id}`}
      className={cn(
        'group block overflow-hidden rounded-2xl border border-border bg-white shadow-sm',
        'transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        isUnavailable && 'opacity-60',
        className
      )}
      style={style}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={item.name}
          loading="lazy"
          onError={handleImgError}
          className={cn(
            'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105',
            isUnavailable && 'grayscale'
          )}
        />
        <div className="absolute top-3 right-3">
          <Badge variant={isUnavailable ? 'error' : 'success'}>
            {isUnavailable ? 'Unavailable' : 'Available'}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        {item.category && (
          <span className="text-xs font-medium text-primary">{item.category.name}</span>
        )}
        <h3 className="mt-1 font-display text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">
          {item.name}
        </h3>
        {preview ? (
          <p className="mt-1.5 text-sm text-text-secondary line-clamp-2">
            <span className="font-medium text-text-primary">Ingredients: </span>
            {preview}
            {ingredients.length > 3 ? '…' : ''}
          </p>
        ) : item.description ? (
          <p className="mt-1.5 text-sm text-text-secondary line-clamp-2">{item.description}</p>
        ) : null}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-bold text-primary">{formatPrice(item.price)}</p>
          <span className="text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}
