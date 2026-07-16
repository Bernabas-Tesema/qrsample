import { Link } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/utils';
import { resolveCategoryImage } from '@/data/menu-images';
import { CATEGORY_IMAGES, PLACEHOLDER_IMAGE } from '@/data/item-images';
import type { Category } from '@/types';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryCardProps {
  category: Category;
  itemCount?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function CategoryCard({ category, itemCount, className, style }: CategoryCardProps) {
  const { slug } = useRestaurant();
  const { t, translateCategory } = useLanguage();
  const [imgSrc, setImgSrc] = useState(() => resolveCategoryImage(category.name, category.image));
  const [fallbackAttempt, setFallbackAttempt] = useState(0);

  const handleImgError = () => {
    const next = fallbackAttempt + 1;
    setFallbackAttempt(next);
    if (next === 1 && CATEGORY_IMAGES[category.name]) {
      setImgSrc(CATEGORY_IMAGES[category.name]);
      return;
    }
    setImgSrc(PLACEHOLDER_IMAGE);
  };

  return (
    <Link
      to={`/r/${slug}/category/${category.id}`}
      className={cn(
        'group relative block overflow-hidden rounded-2xl shadow-sm',
        'transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        className
      )}
      style={style}
    >
      <div className="aspect-[3/2] overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={category.name}
          loading="lazy"
          onError={handleImgError}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-display text-xl font-semibold text-white">
          {translateCategory(category.name)}
        </h3>
        {itemCount !== undefined && (
          <p className="mt-1 text-sm text-white/80">
            {itemCount} {t('items')}
          </p>
        )}
      </div>
    </Link>
  );
}
