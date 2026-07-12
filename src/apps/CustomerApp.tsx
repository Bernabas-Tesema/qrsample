import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { RestaurantProvider } from '@/contexts/RestaurantContext';
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

function RestaurantRoutes() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <RestaurantProvider slug={slug}>
      <CustomerLayout />
    </RestaurantProvider>
  );
}

export default function CustomerApp() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/r/daros-hotel" replace />} />

          <Route path="/r/:slug" element={<RestaurantRoutes />}>
            <Route index element={<HomePage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="category/:categoryId" element={<CategoryDetailPage />} />
            <Route path="item/:itemId" element={<FoodDetailPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
