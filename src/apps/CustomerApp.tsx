import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { RestaurantProvider } from '@/contexts/RestaurantContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CartProvider } from '@/contexts/CartContext';
import { RatingProvider } from '@/contexts/RatingContext';
import { PageLoader } from '@/components/ui/Loading';

const CustomerLayout = lazy(() =>
  import('@/layouts/CustomerLayout').then((m) => ({ default: m.CustomerLayout }))
);
const HomePage = lazy(() =>
  import('@/pages/customer/HomePage').then((m) => ({ default: m.HomePage }))
);
const MenuPage = lazy(() =>
  import('@/pages/customer/MenuPage').then((m) => ({ default: m.MenuPage }))
);
const CategoriesPage = lazy(() =>
  import('@/pages/customer/CategoriesPage').then((m) => ({ default: m.CategoriesPage }))
);
const CategoryDetailPage = lazy(() =>
  import('@/pages/customer/CategoryDetailPage').then((m) => ({ default: m.CategoryDetailPage }))
);
const FoodDetailPage = lazy(() =>
  import('@/pages/customer/FoodDetailPage').then((m) => ({ default: m.FoodDetailPage }))
);
const AboutPage = lazy(() =>
  import('@/pages/customer/AboutContactPage').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import('@/pages/customer/AboutContactPage').then((m) => ({ default: m.ContactPage }))
);

function RedirectToAdmin() {
  const location = useLocation();
  const [showFallback, setShowFallback] = useState(false);

  const target =
    location.pathname === '/admin' || location.pathname === '/admin/'
      ? '/admin/login'
      : `${location.pathname}${location.search}${location.hash}` || '/admin/login';

  useEffect(() => {
    const key = 'daros_admin_redirect_at';
    const last = Number(sessionStorage.getItem(key) || 0);
    const now = Date.now();

    if (now - last < 4000) {
      setShowFallback(true);
      return;
    }

    sessionStorage.setItem(key, String(now));
    const t = window.setTimeout(() => setShowFallback(true), 2500);
    window.location.assign(target.startsWith('/admin') ? target : '/admin/login');
    return () => window.clearTimeout(t);
  }, [target]);

  if (showFallback) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-text-secondary">Admin is taking longer than expected.</p>
        <a
          href="/admin/login"
          className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
        >
          Open Admin Login
        </a>
      </div>
    );
  }

  return <PageLoader text="Opening admin..." />;
}

function RestaurantRoutes() {
  const { slug } = useParams<{ slug: string }>();

  if (slug?.toLowerCase() === 'admin') {
    return <RedirectToAdmin />;
  }

  return (
    <RestaurantProvider slug={slug}>
      <LanguageProvider>
        <CartProvider>
          <RatingProvider>
            <CustomerLayout />
          </RatingProvider>
        </CartProvider>
      </LanguageProvider>
    </RestaurantProvider>
  );
}

export default function CustomerApp() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/r/daros-hotel" replace />} />
          <Route path="/admin/*" element={<RedirectToAdmin />} />

          <Route path="/r/:slug" element={<RestaurantRoutes />}>
            <Route index element={<HomePage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="category/:categoryId" element={<CategoryDetailPage />} />
            <Route path="item/:itemId" element={<FoodDetailPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/r/daros-hotel" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
