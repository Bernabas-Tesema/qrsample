import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AdminHeader } from '@/components/admin/Sidebar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from '@/services/api';

interface ProfileForm {
  full_name: string;
  avatar_url: string;
}

export function ProfilePage() {
  const { user, profile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<ProfileForm>({
    defaultValues: {
      full_name: profile?.full_name || '',
      avatar_url: profile?.avatar_url || '',
    },
  });

  const avatarValue = watch('avatar_url');

  const onSubmit = async (data: ProfileForm) => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user.id, data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader title="Profile" />

      <div className="p-6 lg:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-6">
          {success && (
            <div className="rounded-xl bg-success/10 px-4 py-3 text-sm text-success">
              Profile updated!
            </div>
          )}

          <ImageUpload
            value={avatarValue}
            onChange={(url) => setValue('avatar_url', url)}
            folder="avatars"
            aspectRatio="aspect-square"
            className="max-w-[160px] mx-auto"
          />

          <Input label="Full Name" {...register('full_name')} />
          <Input label="Email" value={profile?.email || user?.email || ''} disabled />

          <Button type="submit" loading={saving}>
            Update Profile
          </Button>
        </form>
      </div>
    </div>
  );
}

export function SettingsPage() {
  return (
    <div>
      <AdminHeader title="System Settings" />

      <div className="p-6 lg:p-8">
        <div className="max-w-2xl space-y-6">
          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-text-primary">QR Code</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Your restaurant menu is accessible at the following URL. Use this URL to generate QR codes for your tables.
            </p>
            <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 font-mono text-sm text-text-primary">
              {window.location.origin}/r/daros-hotel
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-text-primary">Environment</h2>
            <ul className="mt-4 space-y-2 text-sm text-text-secondary">
              <li>Frontend: Vercel</li>
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
