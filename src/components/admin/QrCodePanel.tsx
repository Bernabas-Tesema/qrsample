import { useMemo, useState } from 'react';
import { Download, Copy, Check, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const SLUG = import.meta.env.VITE_DEFAULT_RESTAURANT_SLUG || 'wubate-hotel';

export function getCustomerMenuUrl(): string {
  const configured = import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined;
  const origin =
    configured?.replace(/\/$/, '') ||
    (typeof window !== 'undefined' ? window.location.origin : '');
  return `${origin}/r/${SLUG}`;
}

export function getAdminLoginUrl(): string {
  const configured = import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined;
  const origin =
    configured?.replace(/\/$/, '') ||
    (typeof window !== 'undefined' ? window.location.origin : '');
  return `${origin}/admin/login`;
}

/** Build a downloadable QR image URL (PNG) for the customer menu */
export function getQrImageUrl(menuUrl: string, size = 512): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=12&data=${encodeURIComponent(menuUrl)}`;
}

interface QrCodePanelProps {
  className?: string;
}

export function QrCodePanel({ className = '' }: QrCodePanelProps) {
  const menuUrl = useMemo(() => getCustomerMenuUrl(), []);
  const qrUrl = useMemo(() => getQrImageUrl(menuUrl), [menuUrl]);
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Could not copy. Select and copy the URL manually.');
    }
  };

  const downloadPng = async () => {
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = 'wubate-menu-qr.png';
      a.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Fallback: open image so user can save manually
      window.open(qrUrl, '_blank');
    }
  };

  return (
    <div className={`rounded-2xl border border-border bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center gap-2">
        <QrCode className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-text-primary">Table QR Code</h2>
      </div>
      <p className="mt-2 text-sm text-text-secondary">
        Guests scan this QR to open the customer menu. Print and place it on each table.
        Admin stays separate at <span className="font-mono text-xs">/admin/login</span>.
      </p>

      <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-inner">
          <img
            src={qrUrl}
            alt="QR code for Wubate menu"
            className="h-56 w-56"
            width={224}
            height={224}
          />
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
              Customer menu URL (QR target)
            </p>
            <div className="mt-2 break-all rounded-xl bg-gray-50 px-4 py-3 font-mono text-sm text-text-primary">
              {menuUrl}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={downloadPng}>
              <Download className="h-4 w-4" />
              Download PNG
            </Button>
            <Button type="button" variant="outline" onClick={copyUrl}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy URL'}
            </Button>
            <a href={menuUrl} target="_blank" rel="noopener noreferrer" className="inline-flex">
              <Button type="button" variant="outline">
                Open menu
              </Button>
            </a>
          </div>

          <p className="text-xs text-text-secondary">
            After deploy, set <code className="rounded bg-gray-100 px-1">VITE_PUBLIC_SITE_URL</code> in
            Vercel to your live domain (e.g. https://your-app.vercel.app) so printed QRs point to
            production.
          </p>
        </div>
      </div>
    </div>
  );
}
