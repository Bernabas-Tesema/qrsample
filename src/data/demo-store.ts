import type { Category, MenuItem } from '@/types';
import {
  DAROS_CATEGORIES,
  DAROS_MENU_ITEMS,
  DAROS_RESTAURANT_ID,
} from '@/data/daros-menu';
import { getMenuItemImageByName } from '@/data/item-images';

const STORAGE_KEY = 'daros-demo-menu-items';
const CATEGORIES_KEY = 'daros-demo-categories';

function loadItems(): MenuItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MenuItem[];
  } catch {
    /* ignore */
  }
  return DAROS_MENU_ITEMS.map((item) => ({ ...item }));
}

function saveItems(items: MenuItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function loadCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (raw) return JSON.parse(raw) as Category[];
  } catch {
    /* ignore */
  }
  return DAROS_CATEGORIES.map((c) => ({ ...c }));
}

function saveCategories(categories: Category[]) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

let itemsCache = typeof localStorage !== 'undefined' ? loadItems() : [...DAROS_MENU_ITEMS];
let categoriesCache =
  typeof localStorage !== 'undefined' ? loadCategories() : [...DAROS_CATEGORIES];

function withCategory(item: MenuItem): MenuItem {
  const category = categoriesCache.find((c) => c.id === item.category_id);
  return { ...item, category };
}

export function demoGetCategories(restaurantId: string, activeOnly = false): Category[] {
  if (restaurantId !== DAROS_RESTAURANT_ID) return [];
  return categoriesCache
    .filter((c) => !activeOnly || c.status === 'active')
    .sort((a, b) => a.display_order - b.display_order);
}

export function demoGetMenuItems(restaurantId: string, categoryId?: string): MenuItem[] {
  if (restaurantId !== DAROS_RESTAURANT_ID) return [];
  let items = itemsCache.map(withCategory);
  if (categoryId) items = items.filter((i) => i.category_id === categoryId);
  return items.sort((a, b) => a.display_order - b.display_order);
}

export function demoGetMenuItemById(id: string): MenuItem | null {
  const item = itemsCache.find((i) => i.id === id);
  return item ? withCategory(item) : null;
}

export function demoCreateMenuItem(
  item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at' | 'category'>
): MenuItem {
  const now = new Date().toISOString();
  const created: MenuItem = {
    ...item,
    id: `item-${Date.now()}`,
    image: item.image || getMenuItemImageByName(item.name) || null,
    created_at: now,
    updated_at: now,
  };
  itemsCache = [...itemsCache, created];
  saveItems(itemsCache);
  return withCategory(created);
}

export function demoUpdateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem {
  const index = itemsCache.findIndex((i) => i.id === id);
  if (index < 0) throw new Error('Item not found');
  const { category: _c, ...rest } = updates;
  void _c;
  const updated: MenuItem = {
    ...itemsCache[index],
    ...rest,
    updated_at: new Date().toISOString(),
  };
  itemsCache = [...itemsCache];
  itemsCache[index] = updated;
  saveItems(itemsCache);
  return withCategory(updated);
}

export function demoDeleteMenuItem(id: string): void {
  itemsCache = itemsCache.filter((i) => i.id !== id);
  saveItems(itemsCache);
}

export function demoCreateCategory(
  category: Omit<Category, 'id' | 'created_at'>
): Category {
  const created: Category = {
    ...category,
    id: `cat-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  categoriesCache = [...categoriesCache, created];
  saveCategories(categoriesCache);
  return created;
}

export function demoUpdateCategory(id: string, updates: Partial<Category>): Category {
  const index = categoriesCache.findIndex((c) => c.id === id);
  if (index < 0) throw new Error('Category not found');
  const updated = { ...categoriesCache[index], ...updates };
  categoriesCache = [...categoriesCache];
  categoriesCache[index] = updated;
  saveCategories(categoriesCache);
  return updated;
}

export function demoDeleteCategory(id: string): void {
  categoriesCache = categoriesCache.filter((c) => c.id !== id);
  itemsCache = itemsCache.filter((i) => i.category_id !== id);
  saveCategories(categoriesCache);
  saveItems(itemsCache);
}

export const DEMO_ADMIN = {
  email: 'berni@gmail.com',
  password: '12341234',
  profile: {
    id: 'demo-admin-user',
    full_name: 'Berni Admin',
    email: 'berni@gmail.com',
    role: 'admin' as const,
    restaurant_id: DAROS_RESTAURANT_ID,
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
};

const DEMO_SESSION_KEY = 'daros-demo-admin-session';

export function isDemoAdminSession(): boolean {
  try {
    return localStorage.getItem(DEMO_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function setDemoAdminSession(active: boolean) {
  if (active) localStorage.setItem(DEMO_SESSION_KEY, '1');
  else localStorage.removeItem(DEMO_SESSION_KEY);
}
