import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Leaf } from 'lucide-react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { getMenuItemById, getRelatedMenuItems } from '@/services/api';
import { FoodCard } from '@/components/customer/FoodCard';
import { PageLoader } from '@/components/ui/Loading';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, parseIngredients, isPricingDescription } from '@/utils';
import { resolveMenuItemImage } from '@/data/menu-images';
import {
  getMenuItemImageByName,
  CATEGORY_ID_TO_NAME,
  CATEGORY_IMAGES,
  PLACEHOLDER_IMAGE,
} from '@/data/item-images';
import type { MenuItem } from '@/types';

export function FoodDetailPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const { slug } = useRestaurant();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [related, setRelated] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!itemId) return;

    async function load() {
      const data = await getMenuItemById(itemId!);
      setItem(data);
      if (data) {
        const rel = await getRelatedMenuItems(data.id, data.category_id);
        setRelated(rel);
      }
      setLoading(false);
    }

    load();
  }, [itemId]);

  if (loading) return <PageLoader text="Loading item..." />;
  if (!item) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-xl font-semibold">Item not found</h2>
        <Link to={`/r/${slug}/menu`} className="mt-4 inline-block text-primary hover:underline">
          Back to Menu
        </Link>
      </div>
    );
  }

  const isUnavailable = item.availability === 'unavailable';
  const ingredients = parseIngredients(item.description);
  const isPricing = isPricingDescription(item.description);
  const [imgSrc, setImgSrc] = useState(() =>
    resolveMenuItemImage(item.name, item.category_id, item.image)
  );
  const [fallbackAttempt, setFallbackAttempt] = useState(0);

  useEffect(() => {
    setImgSrc(resolveMenuItemImage(item.name, item.category_id, item.image));
    setFallbackAttempt(0);
  }, [item]);

  const handleImgError = () => {
    const next = fallbackAttempt + 1;
    setFallbackAttempt(next);
    if (next === 1) {
      const mapped = getMenuItemImageByName(item.name);
      if (mapped) { setImgSrc(mapped); return; }
    }
    const cat = CATEGORY_ID_TO_NAME[item.category_id];
    if (next <= 2 && cat && CATEGORY_IMAGES[cat]) {
      setImgSrc(CATEGORY_IMAGES[cat]);
      return;
    }
    setImgSrc(PLACEHOLDER_IMAGE);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to={`/r/${slug}/menu`}
        className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Menu
      </Link>

      {/* Header */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden bg-gray-100">
          <img
            src={imgSrc}
            alt={item.name}
            onError={handleImgError}
            className={`h-full w-full object-cover ${isUnavailable ? 'grayscale opacity-70' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {item.category && (
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {item.category.name}
              </span>
            )}
            <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-4xl">
              {item.name}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-4">
          <span className="text-2xl font-bold text-primary">{formatPrice(item.price)}</span>
          <Badge variant={isUnavailable ? 'error' : 'success'}>
            {isUnavailable ? 'Currently Unavailable' : 'Available'}
          </Badge>
        </div>

        {/* Ingredients — main focus */}
        <div className="px-6 py-8">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-display text-xl font-semibold text-text-primary">
              Ingredients
            </h2>
          </div>

          {ingredients.length > 0 ? (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {ingredients.map((ingredient) => (
                <li
                  key={ingredient}
                  className="flex items-center gap-3 rounded-xl border border-border bg-gray-50 px-4 py-3 text-sm font-medium text-text-primary"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                  {ingredient}
                </li>
              ))}
            </ul>
          ) : isPricing && item.description ? (
            <div className="mt-6 rounded-xl bg-primary/5 border border-primary/20 px-5 py-4">
              <p className="text-sm font-medium text-text-primary">Serving Options</p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {item.description}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-text-secondary">
              Ingredient details for this item are not listed. Please ask our staff for more
              information.
            </p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-text-primary">
            More from {item.category?.name}
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {related.map((rel) => (
              <FoodCard key={rel.id} item={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
