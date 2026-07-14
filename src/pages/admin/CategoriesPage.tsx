import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { AdminHeader } from '@/components/admin/Sidebar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Badge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/contexts/AuthContext';
import { useCategories } from '@/hooks';
import { SOBANA_RESTAURANT_ID } from '@/services/api';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  logActivity,
} from '@/services/api';
import type { Category, CategoryFormData } from '@/types';

export function CategoriesAdminPage() {
  const { profile } = useAuth();
  const restaurantId = profile?.restaurant_id || SOBANA_RESTAURANT_ID;
  const { categories, loading, refresh } = useCategories(restaurantId);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CategoryFormData>({
    defaultValues: { name: '', image: '', display_order: 0, status: 'active' },
  });

  const imageValue = watch('image');

  const openCreate = () => {
    setEditing(null);
    reset({ name: '', image: '', display_order: categories.length + 1, status: 'active' });
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    reset({
      name: cat.name,
      image: cat.image || '',
      display_order: cat.display_order,
      status: cat.status,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: CategoryFormData) => {
    setSaving(true);
    try {
      if (editing) {
        await updateCategory(editing.id, data);
        await logActivity(restaurantId, 'Updated', 'category', editing.id, data.name);
      } else {
        const created = await createCategory({ ...data, restaurant_id: restaurantId });
        await logActivity(restaurantId, 'Created', 'category', created.id, data.name);
      }
      setModalOpen(false);
      refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await deleteCategory(cat.id);
      await logActivity(restaurantId, 'Deleted', 'category', cat.id, cat.name);
      refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to delete');
    }
  };

  return (
    <div>
      <AdminHeader
        title="Categories"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        }
      />

      <div className="p-6 lg:p-8">
        {loading ? (
          <PageLoader />
        ) : categories.length === 0 ? (
          <EmptyState title="No categories" description="Create your first menu category" action={<Button onClick={openCreate}>Add Category</Button>} />
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-white p-4 shadow-sm"
              >
                <GripVertical className="h-5 w-5 text-gray-300 cursor-grab" />
                {cat.image && (
                  <img src={cat.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-text-primary">{cat.name}</p>
                  <p className="text-xs text-text-secondary">Order: {cat.display_order}</p>
                </div>
                <Badge variant={cat.status === 'active' ? 'success' : 'default'}>
                  {cat.status}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(cat)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(cat)}>
                    <Trash2 className="h-4 w-4 text-error" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Category' : 'Create Category'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Category Name"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
          <ImageUpload
            value={imageValue}
            onChange={(url) => setValue('image', url)}
            folder="categories"
          />
          <Input
            label="Display Order"
            type="number"
            {...register('display_order', { valueAsNumber: true })}
          />
          <Select
            label="Status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            {...register('status')}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
