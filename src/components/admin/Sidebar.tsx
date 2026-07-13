import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Grid3X3,
  UtensilsCrossed,
  Settings,
  Image,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ExternalLink,
  QrCode,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils';
import { useAuth } from '@/contexts/AuthContext';
import { getCustomerMenuUrl } from '@/components/admin/QrCodePanel';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/categories', label: 'Categories', icon: Grid3X3 },
  { to: '/menu-items', label: 'Menu Items', icon: UtensilsCrossed },
  { to: '/restaurant', label: 'Restaurant', icon: Settings },
  { to: '/media', label: 'Media Library', icon: Image },
  { to: '/settings', label: 'QR & Settings', icon: QrCode },
  { to: '/profile', label: 'Profile', icon: User },
];

export function AdminSidebar() {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <img
          src="/images/daros-logo.png"
          alt="Daros International Hotel"
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">Daros Admin</p>
          <p className="text-xs text-text-secondary truncate">
            {profile?.full_name || profile?.email || 'Administrator'}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-border p-4">
        <a
          href={getCustomerMenuUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary transition-colors"
        >
          <ExternalLink className="h-5 w-5" />
          View Customer Menu
        </a>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-error hover:bg-error/5 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-white p-2 shadow-md lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:fixed lg:inset-y-0 lg:flex">{sidebar}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full animate-slide-up">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 z-10 rounded-lg p-1 bg-white shadow"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </div>
        </div>
      )}
    </>
  );
}

export function AdminHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-white px-6 py-4 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="hidden rounded-lg p-1.5 text-text-secondary hover:bg-gray-100 lg:flex"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold text-text-primary lg:text-2xl">{title}</h1>
      </div>
      {action}
    </header>
  );
}
