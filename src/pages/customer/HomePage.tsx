import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useCategories } from '@/hooks';
import { CategoryCard } from '@/components/customer/CategoryCard';
import { PageLoader } from '@/components/ui/Loading';
import { PRICE_NOTE } from '@/data/daros-menu';
import { getImageUrl } from '@/utils';

export function HomePage() {
  const { restaurant, slug } = useRestaurant();
  const { categories, loading } = useCategories(restaurant?.id, true);
  const basePath = `/r/${slug}`;

  if (!restaurant) return <PageLoader />;

  const bannerUrl = getImageUrl(
    restaurant.banner,
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&h=500&fit=crop'
  );

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={bannerUrl}
          alt={restaurant.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="relative flex h-full items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="animate-slide-up">
              {restaurant.logo && (
                <img
                  src={restaurant.logo}
                  alt=""
                  className="mb-4 h-20 w-20 rounded-full object-cover ring-4 ring-white/30 shadow-lg"
                />
              )}
              <h1 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                {restaurant.name}
              </h1>
              {restaurant.welcome_message && (
                <p className="mt-3 max-w-xl text-lg text-white/90">
                  {restaurant.welcome_message}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {restaurant.address && (
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="rounded-xl bg-primary/10 p-2.5">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Address</h3>
                <p className="mt-1 text-sm text-text-secondary">{restaurant.address}</p>
              </div>
            </div>
          )}
          {restaurant.phone && (
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="rounded-xl bg-primary/10 p-2.5">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Phone</h3>
                <a href={`tel:${restaurant.phone}`} className="mt-1 text-sm text-text-secondary hover:text-primary">
                  {restaurant.phone}
                </a>
              </div>
            </div>
          )}
          {restaurant.opening_hours?.monday && (
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="rounded-xl bg-primary/10 p-2.5">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Open Today</h3>
                <p className="mt-1 text-sm text-text-secondary">
                  {restaurant.opening_hours.monday}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Introduction */}
      {restaurant.description && (
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="font-display text-3xl font-semibold text-text-primary">
              About Our Restaurant
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-text-secondary">
              {restaurant.description}
            </p>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold text-text-primary">
              Menu Categories
            </h2>
            <p className="mt-1 text-text-secondary">Explore our delicious offerings</p>
          </div>
          <Link
            to={`${basePath}/categories`}
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover sm:flex"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <PageLoader />
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((cat, i) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                style={{ animationDelay: `${i * 80}ms` }}
                className="animate-slide-up"
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            to={`${basePath}/menu`}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            Browse Full Menu <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="mt-10 text-center text-sm text-text-secondary italic">
          {PRICE_NOTE}
        </p>
      </section>
    </div>
  );
}
