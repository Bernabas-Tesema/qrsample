import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Restaurant } from '@/types';
import { getRestaurantBySlug } from '@/services/api';

interface RestaurantContextType {
  restaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
  slug: string;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const DEFAULT_SLUG = import.meta.env.VITE_DEFAULT_RESTAURANT_SLUG || 'daros-hotel';

export function RestaurantProvider({
  children,
  slug,
}: {
  children: ReactNode;
  slug?: string;
}) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const resolvedSlug = slug || DEFAULT_SLUG;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getRestaurantBySlug(resolvedSlug);
        if (!cancelled) {
          if (data) {
            setRestaurant(data);
          } else {
            setError('Restaurant not found');
          }
        }
      } catch {
        if (!cancelled) setError('Failed to load restaurant');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [resolvedSlug]);

  return (
    <RestaurantContext.Provider value={{ restaurant, loading, error, slug: resolvedSlug }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) throw new Error('useRestaurant must be used within RestaurantProvider');
  return context;
}
