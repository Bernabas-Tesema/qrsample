import { Outlet } from 'react-router-dom';
import { CustomerNavbar } from '@/components/customer/Navbar';
import { CustomerFooter } from '@/components/customer/Footer';
import { PageLoader } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/EmptyState';
import { useRestaurant } from '@/contexts/RestaurantContext';

export function CustomerLayout() {
  const { loading, error } = useRestaurant();

  if (loading) return <PageLoader text="Loading menu..." />;
  if (error) {
    return (
      <ErrorState
        title="Restaurant Not Found"
        description={`${error}. Guest menu: /r/daros-hotel — Admin: /admin/login`}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <CustomerNavbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  );
}
