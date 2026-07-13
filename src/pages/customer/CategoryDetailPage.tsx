import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { getCategoryById } from '@/services/api';
import { useMenuItems } from '@/hooks';
import { FoodCard } from '@/components/customer/FoodCard';
import { PageLoader } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Category } from '@/types';

export function CategoryDetailPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { restaurant, slug } = useRestaurant();
  const { items, loading: itemsLoading } = useMenuItems(restaurant?.id, categoryId, {
    availableOnly: true,
  });
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;
    getCategoryById(categoryId).then((cat) => {
      setCategory(cat);
      setLoading(false);
    });
  }, [categoryId]);

  if (loading || itemsLoading) return <PageLoader />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to={`/r/${slug}/categories`}
        className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Categories
      </Link>

      <div className="mt-6">
        <h1 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
          {category?.name || 'Category'}
        </h1>
        <p className="mt-1 text-text-secondary">
          {items.length} {items.length === 1 ? 'item' : 'items'} available
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No items in this category"
          description="Check back soon for new additions"
        />
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, i) => (
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
