import { useState, useEffect, useCallback } from 'react';
import type { Category, MenuItem } from '@/types';
import { getCategories, getMenuItems } from '@/services/api';

export function useCategories(restaurantId: string | undefined, activeOnly = false) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!restaurantId) return;
    setLoading(true);
    try {
      const data = await getCategories(restaurantId, activeOnly);
      setCategories(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, [restaurantId, activeOnly]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { categories, loading, error, refresh };
}

export function useMenuItems(
  restaurantId: string | undefined,
  categoryId?: string,
  options?: { availableOnly?: boolean }
) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const availableOnly = options?.availableOnly ?? false;

  const refresh = useCallback(async () => {
    if (!restaurantId) return;
    setLoading(true);
    try {
      const data = await getMenuItems(restaurantId, categoryId, { availableOnly });
      setItems(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  }, [restaurantId, categoryId, availableOnly]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, error, refresh };
}

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
