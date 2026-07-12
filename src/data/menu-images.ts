import {
  getMenuItemImageByName,
  CATEGORY_IMAGES,
  CATEGORY_ID_TO_NAME,
  getGuaranteedFallbackImage,
} from '@/data/item-images';

function isCustomUpload(url: string): boolean {
  return (
    url.includes('/storage/') ||
    (url.startsWith('/images/') && !url.includes('placeholder'))
  );
}

/** Always resolve fresh — mapped name takes priority over stale stored URLs */
export function resolveMenuItemImage(
  name: string,
  categoryId?: string,
  storedImage?: string | null
): string {
  const mapped = getMenuItemImageByName(name);
  if (mapped) return mapped;

  if (storedImage && isCustomUpload(storedImage)) return storedImage;

  const categoryName = categoryId ? CATEGORY_ID_TO_NAME[categoryId] : undefined;
  if (categoryName && CATEGORY_IMAGES[categoryName]) {
    return CATEGORY_IMAGES[categoryName];
  }

  return getGuaranteedFallbackImage(name);
}

export function resolveCategoryImage(categoryName: string, storedImage?: string | null): string {
  if (storedImage && isCustomUpload(storedImage)) return storedImage;
  return CATEGORY_IMAGES[categoryName] || getGuaranteedFallbackImage(categoryName);
}

export { CATEGORY_IMAGES };
