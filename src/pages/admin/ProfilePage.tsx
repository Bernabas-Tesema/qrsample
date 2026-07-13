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
