import { Navigate, Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/Sidebar';
import { PageLoader } from '@/components/ui/Loading';
import { useAuth } from '@/contexts/AuthContext';

export function AdminLayout() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <PageLoader text="Checking authentication..." />;

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:pl-64">
        <Outlet />
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <PageLoader />;
  if (!user || !isAdmin) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
