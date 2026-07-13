import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { AdminHeader } from '@/components/admin/Sidebar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Badge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/contexts/AuthContext';
import { useMenuItems, useCategories } from '@/hooks';
import {
  DAROS_RESTAURANT_ID,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  logActivity,
} from '@/services/api';
import { formatPrice } from '@/utils';
import type { MenuItem, MenuItemFormData } from '@/types';

export function MenuItemsAdminPage() {
  const { profile } = useAuth();
  const restaurantId = profile?.restaurant_id || DAROS_RESTAURANT_ID;
  const { items, loading, refresh } = useMenuItems(restaurantId);
  const { categories } = useCategories(restaurantId);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<MenuItemFormData>({
    defaultValues: {
      name: '',
      description: '',
      image: '',
      price: 0,
      category_id: '',
      availability: 'available',
      display_order: 0,
    },
  });

  const imageValue = watch('image');
  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  const filteredItems = useMemo(() => {
    if (categoryFilter === 'all') return items;
    return items.filter((i) => i.category_id === categoryFilter);
  }, [items, categoryFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, MenuItem[]>();
    for (const item of filteredItems) {
      const key = item.category_id;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return categories
      .filter((c) => map.has(c.id))
      .map((c) => ({ category: c, items: map.get(c.id)! }));
  }, [filteredItems, categories]);

  const openCreate = () => {
    setEditing(null);
    reset({
      name: '',
      description: '',
      image: '',
      price: 0,
      category_id: categoryFilter !== 'all' ? categoryFilter : categories[0]?.id || '',
      availability: 'available',
      display_order: items.length + 1,
    });
    setModalOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditing(item);
    reset({
      name: item.name,
      description: item.description || '',
      image: item.image || '',
      price: item.price,
      category_id: item.category_id,
      availability: item.availability,
      display_order: item.display_order,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: MenuItemFormData) => {
    setSaving(true);
    try {
      if (editing) {
        await updateMenuItem(editing.id, data);
        await logActivity(restaurantId, 'Updated', 'menu_item', editing.id, data.name);
      } else {
        const created = await createMenuItem({ ...data, restaurant_id: restaurantId });
        await logActivity(restaurantId, 'Created', 'menu_item', created.id, data.name);
      }
      setModalOpen(false);
      refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: MenuItem) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    try {
      await deleteMenuItem(item.id);
      await logActivity(restaurantId, 'Deleted', 'menu_item', item.id, item.name);
      refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to delete');
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    const next = item.availability === 'available' ? 'unavailable' : 'available';
    setTogglingId(item.id);
    try {
      await updateMenuItem(item.id, { availability: next });
      await logActivity(
        restaurantId,
        next === 'available' ? 'Enabled today' : 'Disabled today',
        'menu_item',
        item.id,
        item.name
      );
      refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to update availability');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Menu Items"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add Menu Item
          </Button>
        }
      />

      <div className="p-6 lg:p-8">
        <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-text-secondary">
          <strong className="text-text-primary">Available today:</strong> tick the box for each item
          that is available. Unticked items stay hidden from the customer menu.
        </div>

        <div className="mb-4 max-w-xs">
          <Select
            label="Filter by category"
            options={[{ value: 'all', label: 'All Categories' }, ...categoryOptions]}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>

        {loading ? (
          <PageLoader />
        ) : items.length === 0 ? (
          <EmptyState
            title="No menu items"
            description="Add your first menu item"
            action={<Button onClick={openCreate}>Add Item</Button>}
          />
        ) : (
          <div className="space-y-8">
            {grouped.map(({ category, items: catItems }) => (
              <section key={category.id} className="overflow-hidden rounded-xl border border-border bg-white">
                <div className="flex items-center justify-between border-b border-border bg-gray-50 px-4 py-3">
                  <h3 className="font-display text-lg font-semibold text-text-primary">
                    {category.name}
                  </h3>
                  <span className="text-xs text-text-secondary">
                    {catItems.filter((i) => i.availability === 'available').length}/{catItems.length}{' '}
                    available today
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left font-medium text-text-secondary w-28">
                          Available today
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-text-secondary">Item</th>
                        <th className="px-4 py-3 text-left font-medium text-text-secondary">Price</th>
                        <th className="px-4 py-3 text-left font-medium text-text-secondary">Status</th>
                        <th className="px-4 py-3 text-right font-medium text-text-secondary">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {catItems.map((item) => {
                        const available = item.availability === 'available';
                        return (
                          <tr
                            key={item.id}
                            className={`border-b border-border last:border-0 hover:bg-gray-50 ${
                              !available ? 'opacity-60' : ''
                            }`}
                          >
                            <td className="px-4 py-3">
                              <label className="inline-flex cursor-pointer items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                                  checked={available}
                                  disabled={togglingId === item.id}
                                  onChange={() => toggleAvailability(item)}
                                />
                                <span className="sr-only">Available today</span>
                              </label>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt=""
                                    className="h-10 w-10 rounded-lg object-cover"
                                  />
                                )}
                                <span className="font-medium text-text-primary">{item.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-medium text-primary">
                              {formatPrice(item.price)}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={available ? 'success' : 'error'}>
                                {available ? 'Available' : 'Unavailable'}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(item)}>
                                  <Trash2 className="h-4 w-4 text-error" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Menu Item' : 'Add Menu Item'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Item Name"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
          <Textarea label="Description / Ingredients" rows={3} {...register('description')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Price (ETB)"
              type="number"
              step="0.01"
              error={errors.price?.message}
              {...register('price', { required: 'Price is required', valueAsNumber: true, min: 0 })}
            />
            <Select
              label="Category"
              options={categoryOptions}
              error={errors.category_id?.message}
              {...register('category_id', { required: 'Category is required' })}
            />
          </div>
          <ImageUpload
            value={imageValue}
            onChange={(url) => setValue('image', url)}
            folder="menu-items"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                checked={watch('availability') === 'available'}
                onChange={(e) =>
                  setValue('availability', e.target.checked ? 'available' : 'unavailable')
                }
              />
              <span className="text-sm font-medium text-text-primary">Available today</span>
            </label>
            <Input
              label="Display Order"
              type="number"
              {...register('display_order', { valueAsNumber: true })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? 'Save Changes' : 'Add Item'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
