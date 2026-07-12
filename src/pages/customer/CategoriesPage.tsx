import { useRestaurant } from '@/contexts/RestaurantContext';
import { useCategories, useMenuItems } from '@/hooks';
import { CategoryCard } from '@/components/customer/CategoryCard';
import { PageLoader } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { Grid3X3 } from 'lucide-react';

export function CategoriesPage() {
  const { restaurant } = useRestaurant();
  const { categories, loading } = useCategories(restaurant?.id, true);
  const { items } = useMenuItems(restaurant?.id);

  const getItemCount = (categoryId: string) =>
    items.filter((i) => i.category_id === categoryId).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
          Categories
        </h1>
        <p className="mt-2 text-text-secondary">
          Browse our menu by category
        </p>
      </div>

      {loading ? (
        <PageLoader text="Loading categories..." />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<Grid3X3 className="h-8 w-8" />}
          title="No categories yet"
          description="Categories will appear here once added"
        />
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              itemCount={getItemCount(cat.id)}
              style={{ animationDelay: `${i * 80}ms` }}
              className="animate-slide-up"
            />
          ))}
        </div>
      )}
    </div>
  );
}
