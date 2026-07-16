import { useState, useMemo } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMenuItems, useCategories, useDebounce } from '@/hooks';
import { FoodCard } from '@/components/customer/FoodCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { Select } from '@/components/ui/Select';
import { PageLoader } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { UtensilsCrossed } from 'lucide-react';

export function MenuPage() {
  const { restaurant } = useRestaurant();
  const { t, translateCategory } = useLanguage();
  const { items, loading } = useMenuItems(restaurant?.id, undefined, { availableOnly: true });
  const { categories } = useCategories(restaurant?.id, true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const debouncedSearch = useDebounce(search);

  const filtered = useMemo(() => {
    let result = items;

    if (categoryFilter !== 'all') {
      result = result.filter((i) => i.category_id === categoryFilter);
    }

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          i.category?.name.toLowerCase().includes(q)
      );
    }

    return result;
  }, [items, categoryFilter, debouncedSearch]);

  const categoryOptions = [
    { value: 'all', label: t('allCategories') },
    ...categories.map((c) => ({ value: c.id, label: translateCategory(c.name) })),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
          {t('ourMenu')}
        </h1>
        <p className="mt-2 text-text-secondary">{t('menuSubtitle')}</p>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={t('searchPlaceholder')}
          className="flex-1"
        />
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          options={categoryOptions}
          className="sm:w-56"
        />
      </div>

      {loading ? (
        <PageLoader text={t('loading')} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<UtensilsCrossed className="h-8 w-8" />}
          title="No items found"
          description={search ? 'Try a different search term' : 'Menu items will appear here soon'}
        />
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item, i) => (
            <FoodCard
              key={item.id}
              item={item}
              style={{ animationDelay: `${i * 50}ms` }}
              className="animate-slide-up"
            />
          ))}
        </div>
      )}
    </div>
  );
}
