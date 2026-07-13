import { AdminHeader } from '@/components/admin/Sidebar';
import { QrCodePanel, getAdminLoginUrl, getCustomerMenuUrl } from '@/components/admin/QrCodePanel';

export function SettingsPage() {
  const menuUrl = getCustomerMenuUrl();
  const adminUrl = getAdminLoginUrl();

  return (
    <div>
      <AdminHeader title="QR Code & Settings" />

      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <QrCodePanel />

          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-text-primary">Deployed URLs</h2>
            <p className="mt-2 text-sm text-text-secondary">
              One Vercel project serves both apps on different paths.
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="rounded-xl bg-gray-50 px-4 py-3">
                <span className="font-medium text-text-primary">Customer (QR target)</span>
                <p className="mt-1 break-all font-mono text-xs text-text-secondary">{menuUrl}</p>
              </li>
              <li className="rounded-xl bg-gray-50 px-4 py-3">
                <span className="font-medium text-text-primary">Admin dashboard</span>
                <p className="mt-1 break-all font-mono text-xs text-text-secondary">{adminUrl}</p>
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-text-primary">Environment</h2>
            <ul className="mt-4 space-y-2 text-sm text-text-secondary">
              <li>Frontend: Vercel (customer + admin)</li>
              <li>Backend: Supabase Cloud</li>
              <li>Storage: Supabase Storage</li>
              <li>Auth: Supabase Authentication</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
