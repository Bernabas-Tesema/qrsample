import { useEffect, useState } from 'react';
import { Trash2, Image as ImageIcon } from 'lucide-react';
import { AdminHeader } from '@/components/admin/Sidebar';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { PageLoader } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { listImages, deleteImage } from '@/services/api';

export function MediaLibraryPage() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await listImages();
      setImages(data);
    } catch {
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const handleDelete = async (url: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      await deleteImage(url);
      refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to delete');
    }
  };

  return (
    <div>
      <AdminHeader title="Media Library" />

      <div className="p-6 lg:p-8">
        <div className="mb-8 max-w-md">
          <ImageUpload
            value=""
            onChange={() => refresh()}
            folder="uploads"
          />
        </div>

        {loading ? (
          <PageLoader />
        ) : images.length === 0 ? (
          <EmptyState
            icon={<ImageIcon className="h-8 w-8" />}
            title="No images yet"
            description="Upload images using the form above"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {images.map((url) => (
              <div key={url} className="group relative overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                <img src={url} alt="" className="aspect-square w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(url)}
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
