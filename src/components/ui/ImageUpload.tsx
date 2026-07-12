import { useState, useCallback, type DragEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/utils';
import { uploadImage } from '@/services/api';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
  aspectRatio?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = 'uploads',
  className,
  aspectRatio = 'aspect-video',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }

      setUploading(true);
      setError(null);
      try {
        const url = await uploadImage(file, folder);
        onChange(url);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange]
  );

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  if (value) {
    return (
      <div className={cn('relative group', className)}>
        <img
          src={value}
          alt="Upload preview"
          className={cn('w-full rounded-xl object-cover', aspectRatio)}
        />
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={cn(
        'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors',
        dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
        aspectRatio,
        className
      )}
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        className="absolute inset-0 cursor-pointer opacity-0"
        disabled={uploading}
      />
      {uploading ? (
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-2 text-sm text-text-secondary">Uploading...</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="mx-auto mb-3 rounded-full bg-primary/10 p-3">
            {dragOver ? (
              <ImageIcon className="h-6 w-6 text-primary" />
            ) : (
              <Upload className="h-6 w-6 text-primary" />
            )}
          </div>
          <p className="text-sm font-medium text-text-primary">
            Drag & drop or click to upload
          </p>
          <p className="mt-1 text-xs text-text-secondary">PNG, JPG, WebP up to 5MB</p>
        </div>
      )}
      {error && <p className="mt-2 text-xs text-error">{error}</p>}
    </div>
  );
}
