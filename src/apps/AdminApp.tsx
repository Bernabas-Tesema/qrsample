import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/ui/Loading';

const AdminLayout = lazy(() =>
  import('@/layouts/AdminLayout').then((m) => ({ default: m.AdminLayout }))
);
const AdminLoginPage = lazy(() =>
  import('@/pages/admin/LoginPage').then((m) => ({ default: m.AdminLoginPage }))
);
const DashboardPage = lazy(() =>
  import('@/pages/admin/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const CategoriesAdminPage = lazy(() =>
  import('@/pages/admin/CategoriesPage').then((m) => ({ default: m.CategoriesAdminPage }))
);
const MenuItemsAdminPage = lazy(() =>
  import('@/pages/admin/MenuItemsPage').then((m) => ({ default: m.MenuItemsAdminPage }))
);
const RestaurantSettingsPage = lazy(() =>
  import('@/pages/admin/RestaurantPage').then((m) => ({ default: m.RestaurantSettingsPage }))
);
const MediaLibraryPage = lazy(() =>
  import('@/pages/admin/MediaPage').then((m) => ({ default: m.MediaLibraryPage }))
);
const ProfilePage = lazy(() =>
  import('@/pages/admin/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const SettingsPage = lazy(() =>
  import('@/pages/admin/ProfilePage').then((m) => ({ default: m.SettingsPage }))
);

export default function AdminApp() {
  return (
    <BrowserRouter basename="/admin">
      <AuthProvider>
        <Suspense fallback={<PageLoader text="Loading dashboard..." />}>
          <Routes>
            <Route path="/login" element={<AdminLoginPage />} />

            <Route path="/" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="categories" element={<CategoriesAdminPage />} />
              <Route path="menu-items" element={<MenuItemsAdminPage />} />
              <Route path="restaurant" element={<RestaurantSettingsPage />} />
              <Route path="media" element={<MediaLibraryPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
