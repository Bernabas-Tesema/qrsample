import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AdminHeader } from '@/components/admin/Sidebar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { PageLoader } from '@/components/ui/Loading';
import { useAuth } from '@/contexts/AuthContext';
import { getRestaurantById, updateRestaurant, logActivity, SOBANA_RESTAURANT_ID } from '@/services/api';
import { DAYS_OF_WEEK, capitalizeDay } from '@/utils';
import type { Restaurant, RestaurantFormData } from '@/types';

export function RestaurantSettingsPage() {
  const { profile } = useAuth();
  const restaurantId = profile?.restaurant_id || SOBANA_RESTAURANT_ID;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm<RestaurantFormData>();

  const logoValue = watch('logo');
  const bannerValue = watch('banner');

  useEffect(() => {
    getRestaurantById(restaurantId).then((data) => {
      if (data) {
        reset({
          name: data.name,
          slug: data.slug,
          logo: data.logo || '',
          banner: data.banner || '',
          description: data.description || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          welcome_message: data.welcome_message || '',
          google_maps_url: data.google_maps_url || '',
          opening_hours: data.opening_hours || {},
          social_links: data.social_links || {},
        });
      }
      setLoading(false);
    });
  }, [restaurantId, reset]);

  const onSubmit = async (data: RestaurantFormData) => {
    setSaving(true);
    setSuccess(false);
    try {
      const updated = await updateRestaurant(restaurantId, data as Partial<Restaurant>);
      reset({
        name: updated?.name || data.name,
        slug: updated?.slug || data.slug,
        logo: updated?.logo || data.logo || '',
        banner: updated?.banner || data.banner || '',
        description: updated?.description || data.description,
        phone: updated?.phone || data.phone,
        email: updated?.email || data.email,
        address: updated?.address || data.address,
        welcome_message: updated?.welcome_message || data.welcome_message,
        google_maps_url: updated?.google_maps_url || data.google_maps_url,
        opening_hours: updated?.opening_hours || data.opening_hours,
        social_links: updated?.social_links || data.social_links,
      });
      await logActivity(restaurantId, 'Updated', 'restaurant', restaurantId, 'Restaurant settings');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <AdminHeader title="Restaurant Settings" />

      <div className="p-6 lg:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-8">
          {success && (
            <div className="rounded-xl bg-success/10 px-4 py-3 text-sm text-success">
              Settings saved successfully!
            </div>
          )}

          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Basic Information</h2>
            <Input label="Restaurant Name" {...register('name', { required: true })} />
            <Input label="URL Slug" hint="Used in QR code links: /r/your-slug" {...register('slug')} />
            <Textarea label="Description" rows={3} {...register('description')} />
            <Textarea label="Welcome Message" rows={2} {...register('welcome_message')} />
          </section>

          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Images</h2>
            <div>
              <p className="text-sm font-medium text-text-primary mb-2">Logo</p>
              <ImageUpload
                value={logoValue as string}
                onChange={(url) => setValue('logo', url)}
                folder="restaurant"
                aspectRatio="aspect-square"
                className="max-w-xs"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary mb-2">Banner Image</p>
              <ImageUpload
                value={bannerValue as string}
                onChange={(url) => setValue('banner', url)}
                folder="restaurant"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Contact</h2>
            <Input label="Address" {...register('address')} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Phone" {...register('phone')} />
              <Input label="Email" type="email" {...register('email')} />
            </div>
            <Input label="Google Maps URL" {...register('google_maps_url')} />
          </section>

          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Opening Hours</h2>
            {DAYS_OF_WEEK.map((day) => (
              <Input
                key={day}
                label={capitalizeDay(day)}
                placeholder="e.g. 7:00 AM - 11:00 PM"
                {...register(`opening_hours.${day}`)}
              />
            ))}
          </section>

          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Social Media</h2>
            <Input label="Facebook" {...register('social_links.facebook')} />
            <Input label="Instagram" {...register('social_links.instagram')} />
            <Input label="WhatsApp" {...register('social_links.whatsapp')} />
          </section>

          <Button type="submit" loading={saving} size="lg">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}
