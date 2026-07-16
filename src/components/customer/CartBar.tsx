import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { formatPrice } from '@/utils';
import { Button } from '@/components/ui/Button';

export function CartBar() {
  const { items, total, count, addItem, removeItem, clearCart } = useCart();
  const { t } = useLanguage();
  const { slug } = useRestaurant();
  const [open, setOpen] = useState(false);

  if (count === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full bg-primary px-5 py-3 text-white shadow-lg transition hover:bg-primary-hover"
      >
        <ShoppingCart className="h-5 w-5" />
        <span className="text-sm font-semibold">
          {count} {t('items')} · {formatPrice(total)}
        </span>
        <span className="text-xs opacity-90">{t('viewCart')}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-lg font-semibold text-text-primary">
                {t('cart')}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-text-secondary hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[50vh] space-y-3 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-border p-3"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt=""
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-gray-100" />
                  )}
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/r/${slug}/item/${item.id}`}
                      onClick={() => setOpen(false)}
                      className="truncate font-medium text-text-primary hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-primary">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="rounded-full border border-border p-1.5 hover:bg-gray-50"
                      aria-label={t('removeFromCart')}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
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
                      className="rounded-full border border-border p-1.5 hover:bg-gray-50"
                      aria-label={t('addToCart')}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-secondary">{t('total')}</span>
                <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" className="flex-1" onClick={clearCart}>
                  {t('clearCart')}
                </Button>
                <Button className="flex-1" onClick={() => setOpen(false)}>
                  {t('menu')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
