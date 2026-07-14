import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Home, UtensilsCrossed, Grid3X3, Info, Phone } from 'lucide-react';
import { cn } from '@/utils';
import { useRestaurant } from '@/contexts/RestaurantContext';

const navLinks = [
  { to: '', label: 'Home', icon: Home },
  { to: 'menu', label: 'Menu', icon: UtensilsCrossed },
  { to: 'categories', label: 'Categories', icon: Grid3X3 },
  { to: 'about', label: 'About', icon: Info },
  { to: 'contact', label: 'Contact', icon: Phone },
];

export function CustomerNavbar() {
  const { restaurant, slug } = useRestaurant();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const basePath = `/r/${slug}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    const full = path ? `${basePath}/${path}` : basePath;
    return location.pathname === full || location.pathname === `${full}/`;
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-white/80 backdrop-blur-sm'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={basePath} className="flex items-center gap-3">
          {restaurant?.logo ? (
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="h-11 w-11 rounded-full object-contain bg-white ring-2 ring-primary/20"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-display font-bold">
              {restaurant?.name?.charAt(0) || 'M'}
            </div>
          )}
          <span className="hidden font-display text-lg font-semibold text-text-primary sm:block">
            {restaurant?.name || 'Digital Menu'}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to ? `${basePath}/${to}` : basePath}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                isActive(to)
                  ? 'text-primary bg-primary/10'
                  : 'text-text-secondary hover:text-primary hover:bg-primary/5'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-text-primary md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border bg-white px-4 py-4 md:hidden animate-slide-up">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to ? `${basePath}/${to}` : basePath}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                isActive(to)
                  ? 'text-primary bg-primary/10'
                  : 'text-text-secondary hover:bg-gray-50'
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
