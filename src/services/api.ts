import { supabase, STORAGE_BUCKET } from '@/lib/supabase';
import type {
  Restaurant,
  Category,
  MenuItem,
  DashboardStats,
  ActivityLog,
  OpeningHours,
  SocialLinks,
} from '@/types';
import { resolveMenuItemImage } from '@/data/menu-images';
import {
  isDemoMode,
  getDemoRestaurantBySlug,
  getDemoRestaurantById,
  getDemoCategoryById,
  searchDemoMenuItems,
  getDemoRelatedItems,
  SOBANA_RESTAURANT_ID,
} from '@/data/sobana-menu';
import {
  demoGetCategories,
  demoGetMenuItems,
  demoGetMenuItemById,
  demoCreateMenuItem,
  demoUpdateMenuItem,
  demoDeleteMenuItem,
  demoCreateCategory,
  demoUpdateCategory,
  demoDeleteCategory,
  isDemoAdminSession,
} from '@/data/demo-store';

function useLocalData(): boolean {
  return isDemoMode() || isDemoAdminSession();
}

export { SOBANA_RESTAURANT_ID };

// ─── Restaurant ───────────────────────────────────────────────

export async function getRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  if (isDemoMode()) return getDemoRestaurantBySlug(slug);

  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return getDemoRestaurantBySlug(slug);
  return mapRestaurant(data);
}

export async function getRestaurantById(id: string): Promise<Restaurant | null> {
  if (isDemoMode()) return getDemoRestaurantById(id);

  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return getDemoRestaurantById(id);
  return mapRestaurant(data);
}

export async function updateRestaurant(
  id: string,
  updates: Partial<Restaurant>
): Promise<Restaurant | null> {
  if (isDemoMode()) return getDemoRestaurantById(id);

  const { data, error } = await supabase
    .from('restaurants')
    .update({
      ...updates,
      opening_hours: updates.opening_hours as unknown as Record<string, string>,
      social_links: updates.social_links as unknown as Record<string, string>,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapRestaurant(data);
}

function mapRestaurant(row: Record<string, unknown>): Restaurant {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    logo: row.logo as string | null,
    banner: row.banner as string | null,
    description: row.description as string | null,
    phone: row.phone as string | null,
    email: row.email as string | null,
    address: row.address as string | null,
    opening_hours: (row.opening_hours as OpeningHours) || null,
    social_links: (row.social_links as SocialLinks) || null,
    google_maps_url: row.google_maps_url as string | null,
    welcome_message: row.welcome_message as string | null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

// ─── Categories ───────────────────────────────────────────────

export async function getCategories(restaurantId: string, activeOnly = false): Promise<Category[]> {
  if (useLocalData()) return demoGetCategories(restaurantId, activeOnly);

  let query = supabase
    .from('categories')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('display_order', { ascending: true });

  if (activeOnly) query = query.eq('status', 'active');

  const { data, error } = await query;
  if (error) return demoGetCategories(restaurantId, activeOnly);
  const mapped = (data || []).map(mapCategory);
  // Tables exist but seed not run yet
  if (mapped.length === 0) return demoGetCategories(restaurantId, activeOnly);
  return mapped;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  if (useLocalData()) {
    return demoGetCategories(SOBANA_RESTAURANT_ID).find((c) => c.id === id) || getDemoCategoryById(id);
  }

  const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();
  if (error) return getDemoCategoryById(id);
  return mapCategory(data);
}

export async function createCategory(
  category: Omit<Category, 'id' | 'created_at'>
): Promise<Category> {
  if (useLocalData()) return demoCreateCategory(category);

  const { data, error } = await supabase.from('categories').insert(category).select().single();
  if (error) throw new Error(error.message);
  return mapCategory(data);
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  if (useLocalData()) return demoUpdateCategory(id, updates);

  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapCategory(data);
}

export async function deleteCategory(id: string): Promise<void> {
  if (useLocalData()) {
    demoDeleteCategory(id);
    return;
  }
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function reorderCategories(
  items: { id: string; display_order: number }[]
): Promise<void> {
  const updates = items.map(({ id, display_order }) =>
    supabase.from('categories').update({ display_order }).eq('id', id)
  );
  await Promise.all(updates);
}

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    restaurant_id: row.restaurant_id as string,
    name: row.name as string,
    image: row.image as string | null,
    display_order: row.display_order as number,
    status: row.status as Category['status'],
    created_at: row.created_at as string,
  };
}

// ─── Menu Items ───────────────────────────────────────────────

export async function getMenuItems(
  restaurantId: string,
  categoryId?: string,
  options?: { availableOnly?: boolean }
): Promise<MenuItem[]> {
  const availableOnly = options?.availableOnly ?? false;

  if (useLocalData()) {
    const items = demoGetMenuItems(restaurantId, categoryId);
    return availableOnly ? items.filter((i) => i.availability === 'available') : items;
  }

  let query = supabase
    .from('menu_items')
    .select('*, category:categories(*)')
    .eq('restaurant_id', restaurantId)
    .order('display_order', { ascending: true });

  if (categoryId) query = query.eq('category_id', categoryId);
  if (availableOnly) query = query.eq('availability', 'available');

  const { data, error } = await query;
  if (error) {
    const items = demoGetMenuItems(restaurantId, categoryId);
    return availableOnly ? items.filter((i) => i.availability === 'available') : items;
  }
  const mapped = (data || []).map(mapMenuItem);
  if (mapped.length === 0) {
    const items = demoGetMenuItems(restaurantId, categoryId);
    return availableOnly ? items.filter((i) => i.availability === 'available') : items;
  }
  return mapped;
}

export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  if (useLocalData()) return demoGetMenuItemById(id);

  const { data, error } = await supabase
    .from('menu_items')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single();

  if (error) return demoGetMenuItemById(id);
  return mapMenuItem(data);
}

export async function searchMenuItems(
  restaurantId: string,
  query: string
): Promise<MenuItem[]> {
  if (useLocalData()) {
    return searchDemoMenuItems(restaurantId, query).filter((i) => i.availability === 'available');
  }

  const { data, error } = await supabase
    .from('menu_items')
    .select('*, category:categories(*)')
    .eq('restaurant_id', restaurantId)
    .eq('availability', 'available')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('name');

  if (error) {
    return searchDemoMenuItems(restaurantId, query).filter((i) => i.availability === 'available');
  }
  return (data || []).map(mapMenuItem);
}

export async function createMenuItem(
  item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at' | 'category'>
): Promise<MenuItem> {
  if (useLocalData()) return demoCreateMenuItem(item);

  const { data, error } = await supabase
    .from('menu_items')
    .insert(item)
    .select('*, category:categories(*)')
    .single();
  if (error) throw new Error(error.message);
  return mapMenuItem(data);
}

export async function updateMenuItem(
  id: string,
  updates: Partial<MenuItem>
): Promise<MenuItem> {
  const { category, ...rest } = updates;
  void category;

  if (useLocalData()) return demoUpdateMenuItem(id, rest);

  const { data, error } = await supabase
    .from('menu_items')
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, category:categories(*)')
    .single();
  if (error) throw new Error(error.message);
  return mapMenuItem(data);
}

export async function deleteMenuItem(id: string): Promise<void> {
  if (useLocalData()) {
    demoDeleteMenuItem(id);
    return;
  }
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function getRelatedMenuItems(
  itemId: string,
  categoryId: string,
  limit = 4
): Promise<MenuItem[]> {
  if (isDemoMode()) return getDemoRelatedItems(itemId, categoryId, limit);

  const { data, error } = await supabase
    .from('menu_items')
    .select('*, category:categories(*)')
    .eq('category_id', categoryId)
    .neq('id', itemId)
    .eq('availability', 'available')
    .limit(limit);

  if (error) return getDemoRelatedItems(itemId, categoryId, limit);
  return (data || []).map(mapMenuItem);
}

function mapMenuItem(row: Record<string, unknown>): MenuItem {
  const category_id = row.category_id as string;
  const name = row.name as string;
  const storedImage = row.image as string | null;
  const category = row.category ? mapCategory(row.category as Record<string, unknown>) : undefined;

  return {
    id: row.id as string,
    category_id,
    restaurant_id: row.restaurant_id as string,
    name,
    description: row.description as string | null,
    image: resolveMenuItemImage(name, category_id, storedImage),
    price: Number(row.price),
    availability: row.availability as MenuItem['availability'],
    display_order: row.display_order as number,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    category,
  };
}

// ─── Dashboard ───────────────────────────────────────────────

export async function getDashboardStats(restaurantId: string): Promise<DashboardStats> {
  const buildStats = (categories: { length: number }, items: { availability: string }[]) => ({
    totalCategories: categories.length,
    totalMenuItems: items.length,
    availableItems: items.filter((i) => i.availability === 'available').length,
    unavailableItems: items.filter((i) => i.availability === 'unavailable').length,
  });

  if (useLocalData()) {
    return buildStats(demoGetCategories(restaurantId), demoGetMenuItems(restaurantId));
  }

  try {
    const [categories, items] = await Promise.all([
      getCategories(restaurantId),
      getMenuItems(restaurantId),
    ]);

    // Supabase not seeded yet — show built-in Sobana menu counts
    if (categories.length === 0 && items.length === 0) {
      return buildStats(demoGetCategories(restaurantId), demoGetMenuItems(restaurantId));
    }

    return buildStats(categories, items);
  } catch {
    return buildStats(demoGetCategories(restaurantId), demoGetMenuItems(restaurantId));
  }
}

export async function getRecentActivity(
  restaurantId: string,
  limit = 10
): Promise<ActivityLog[]> {
  if (useLocalData() || isDemoMode()) return [];

  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return [];
    return (data || []) as ActivityLog[];
  } catch {
    return [];
  }
}

export async function logActivity(
  restaurantId: string,
  action: string,
  entityType: string,
  entityId?: string,
  details?: string
): Promise<void> {
  if (isDemoMode()) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.from('activity_logs').insert({
    restaurant_id: restaurantId,
    user_id: user?.id || null,
    action,
    entity_type: entityType,
    entity_id: entityId || null,
    details: details || null,
  });
}

// ─── Storage ──────────────────────────────────────────────────

export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  const path = extractStoragePath(url);
  if (!path) return;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  if (error) throw new Error(error.message);
}

export async function listImages(folder?: string): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(folder || '', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

  if (error) throw new Error(error.message);

  return (data || [])
    .filter((f) => f.name !== '.emptyFolderPlaceholder')
    .map((f) => {
      const path = folder ? `${folder}/${f.name}` : f.name;
      const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      return urlData.publicUrl;
    });
}

function extractStoragePath(url: string): string | null {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

// ─── Profile ──────────────────────────────────────────────────

export async function getProfile(userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) return null;
  return data;
}

export async function updateProfile(
  userId: string,
  updates: { full_name?: string; avatar_url?: string }
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
