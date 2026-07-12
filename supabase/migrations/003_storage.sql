-- Storage bucket and policies for menu images

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'menu-images',
  'menu-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Public read access for images
CREATE POLICY "Public can view menu images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-images');

-- Authenticated users can upload images
CREATE POLICY "Authenticated users can upload menu images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'menu-images'
    AND auth.role() = 'authenticated'
  );

-- Authenticated users can update their uploads
CREATE POLICY "Authenticated users can update menu images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'menu-images'
    AND auth.role() = 'authenticated'
  );

-- Authenticated users can delete images
CREATE POLICY "Authenticated users can delete menu images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'menu-images'
    AND auth.role() = 'authenticated'
  );
