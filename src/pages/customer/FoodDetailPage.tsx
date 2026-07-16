import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Leaf, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRatings } from '@/contexts/RatingContext';
import { getMenuItemById, getRelatedMenuItems } from '@/services/api';
import { FoodCard } from '@/components/customer/FoodCard';
import { PageLoader } from '@/components/ui/Loading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
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
  const { t, translateCategory } = useLanguage();
  const { addItem, removeItem, getQuantity, total, count } = useCart();
  const { rateItem, getRating } = useRatings();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [related, setRelated] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(PLACEHOLDER_IMAGE);
  const [fallbackAttempt, setFallbackAttempt] = useState(0);
  const [ratedThanks, setRatedThanks] = useState(false);

  useEffect(() => {
    if (!itemId) return;

    async function load() {
      setLoading(true);
      const data = await getMenuItemById(itemId!);
      setItem(data);
      if (data) {
        const rel = await getRelatedMenuItems(data.id, data.category_id);
        setRelated(rel);
        setImgSrc(resolveMenuItemImage(data.name, data.category_id, data.image));
        setFallbackAttempt(0);
      } else {
        setRelated([]);
      }
      setLoading(false);
    }

    load();
  }, [itemId]);

  useEffect(() => {
    if (!item) return;
    setImgSrc(resolveMenuItemImage(item.name, item.category_id, item.image));
    setFallbackAttempt(0);
  }, [item]);

  const handleImgError = () => {
    if (!item) return;
    const next = fallbackAttempt + 1;
    setFallbackAttempt(next);
    if (next === 1) {
      const mapped = getMenuItemImageByName(item.name);
      if (mapped) {
        setImgSrc(mapped);
        return;
      }
    }
    const cat = CATEGORY_ID_TO_NAME[item.category_id];
    if (next <= 2 && cat && CATEGORY_IMAGES[cat]) {
      setImgSrc(CATEGORY_IMAGES[cat]);
      return;
    }
    setImgSrc(PLACEHOLDER_IMAGE);
  };

  if (loading) return <PageLoader text={t('loading')} />;
  if (!item) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-xl font-semibold">{t('itemNotFound')}</h2>
        <Link to={`/r/${slug}/menu`} className="mt-4 inline-block text-primary hover:underline">
          {t('backToMenu')}
        </Link>
      </div>
    );
  }

  const isUnavailable = item.availability === 'unavailable';
  const ingredients = parseIngredients(item.description);
  const isPricing = isPricingDescription(item.description);
  const qty = getQuantity(item.id);
  const myRating = getRating(item.id).myRating;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to={`/r/${slug}/menu`}
        className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('backToMenu')}
      </Link>

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
                {translateCategory(item.category.name)}
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
            {isUnavailable ? t('unavailable') : t('available')}
          </Badge>
        </div>

        {/* Cart controls */}
        {!isUnavailable && (
          <div className="border-b border-border px-6 py-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={qty === 0}
                  className="rounded-full border border-border p-2 disabled:opacity-40 hover:bg-gray-50"
                  aria-label={t('removeFromCart')}
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="min-w-8 text-center text-lg font-bold text-text-primary">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image,
                    })
                  }
                  className="rounded-full border border-border p-2 hover:bg-gray-50"
                  aria-label={t('addToCart')}
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <Button
                onClick={() =>
                  addItem({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                  })
                }
              >
                <ShoppingCart className="h-4 w-4" />
                {t('addToCart')}
              </Button>
            </div>

            {count > 0 && (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3">
                <span className="text-sm text-text-secondary">
                  {t('cart')}: {count} {t('items')}
                </span>
                <span className="text-lg font-bold text-primary">
                  {t('total')}: {formatPrice(total)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Customer rate (admin sees results elsewhere) */}
        <div className="border-b border-border px-6 py-5">
          <p className="text-sm font-medium text-text-primary">{t('rateFood')}</p>
          <div className="mt-2">
            <StarRating
              value={myRating || 0}
              onChange={(stars) => {
                rateItem(item.id, stars);
                setRatedThanks(true);
              }}
            />
          </div>
          {ratedThanks && (
            <p className="mt-2 text-sm text-success">{t('thanksRating')}</p>
          )}
        </div>

        <div className="px-6 py-8">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-display text-xl font-semibold text-text-primary">
              {t('ingredients')}
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
              <p className="text-sm font-medium text-text-primary">{t('servingOptions')}</p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {item.description}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-text-secondary">{t('noIngredients')}</p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-text-primary">
            {t('moreFrom')} {item.category ? translateCategory(item.category.name) : ''}
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
