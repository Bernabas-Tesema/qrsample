import type { Restaurant, Category, MenuItem } from '@/types';
import { resolveCategoryImage } from '@/data/menu-images';
import { getMenuItemImageByName } from '@/data/item-images';

export const SOBANA_RESTAURANT_ID = 'b0000000-0000-0000-0000-000000000001';

export const SOBANA_RESTAURANT: Restaurant = {
  id: SOBANA_RESTAURANT_ID,
  slug: 'daros-hotel',
  name: 'Daros International Hotel',
  logo: '/images/daros-logo.png',
  banner: '/images/daros-banner.jpg',
  description:
    'Welcome to Daros Hotel Arba Minch — enjoy our full restaurant menu featuring traditional Ethiopian dishes, international cuisine, fresh seafood, pizza, pasta, and premium beverages.',
  phone: '+251 912 549 009',
  email: 'info@daroshotel.et',
  address: 'Arba Minch, Ethiopia',
  welcome_message: 'Thank you for visiting Daros International Hotel — enjoy every meal.',
  opening_hours: {
    monday: '6:00 AM - 11:00 PM',
    tuesday: '6:00 AM - 11:00 PM',
    wednesday: '6:00 AM - 11:00 PM',
    thursday: '6:00 AM - 11:00 PM',
    friday: '6:00 AM - 12:00 AM',
    saturday: '6:00 AM - 12:00 AM',
    sunday: '7:00 AM - 11:00 PM',
  },
  social_links: {
    facebook: 'https://www.facebook.com/daroshotel',
    instagram: 'https://www.instagram.com/daroshotel',
    tiktok: 'https://www.tiktok.com/@daroshotel',
    whatsapp: 'https://wa.me/251912549009',
    youtube: 'https://www.youtube.com/@daroshotel',
  },
  google_maps_url: 'https://maps.google.com/?q=Daros+International+Hotel+Arba+Minch',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

type MenuSeed = { name: string; price: number; description?: string };

function cat(id: string, name: string, order: number): Category {
  return {
    id,
    restaurant_id: SOBANA_RESTAURANT_ID,
    name,
    image: resolveCategoryImage(name),
    display_order: order,
    status: 'active',
    created_at: new Date().toISOString(),
  };
}

function item(
  id: string,
  categoryId: string,
  seed: MenuSeed,
  order: number
): MenuItem {
  return {
    id,
    category_id: categoryId,
    restaurant_id: SOBANA_RESTAURANT_ID,
    name: seed.name,
    description: seed.description || null,
    image: getMenuItemImageByName(seed.name) ?? null,
    price: seed.price,
    availability: 'available',
    display_order: order,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

const C = {
  breakfast: 'cat-breakfast',
  soup: 'cat-soup',
  salad: 'cat-salad',
  chicken: 'cat-chicken',
  fish: 'cat-fish',
  beef: 'cat-beef',
  pasta: 'cat-pasta',
  pizza: 'cat-pizza',
  traditional: 'cat-traditional',
  snack: 'cat-snack',
  dessert: 'cat-dessert',
  extra: 'cat-extra',
  juice: 'cat-juice',
  smoothie: 'cat-special-smoothie',
  hotBev: 'cat-hot-beverages',
  beverages: 'cat-beverages-beers',
  vodka: 'cat-vodka',
  wine: 'cat-wine',
  whisky: 'cat-whisky',
} as const;

export const SOBANA_CATEGORIES: Category[] = [
  cat(C.breakfast, 'Breakfast', 1),
  cat(C.soup, 'Soup', 2),
  cat(C.salad, 'Salad', 3),
  cat(C.chicken, 'Chicken Corner', 4),
  cat(C.fish, 'Fish Corner', 5),
  cat(C.beef, 'Beef Corner', 6),
  cat(C.pasta, 'Pasta Corner', 7),
  cat(C.pizza, 'Pizza Corner', 8),
  cat(C.traditional, 'Traditional Dish', 9),
  cat(C.snack, 'Snack and Sandwich', 10),
  cat(C.dessert, 'Dessert', 11),
  cat(C.extra, 'Extra Topping', 12),
  cat(C.juice, 'Juice', 13),
  cat(C.smoothie, 'Special Smoothie', 14),
  cat(C.hotBev, 'Hot Beverages', 15),
  cat(C.beverages, 'Beverages & Beers', 16),
  cat(C.vodka, 'Vodka', 17),
  cat(C.wine, 'Wine', 18),
  cat(C.whisky, 'Whisky', 19),
];

function buildItems(
  categoryId: string,
  prefix: string,
  seeds: MenuSeed[]
): MenuItem[] {
  return seeds.map((seed, i) =>
    item(`${prefix}-${i + 1}`, categoryId, seed, i + 1)
  );
}

const BREAKFAST: MenuSeed[] = [
  { name: 'Oats', price: 300, description: 'Milk, honey or syrup' },
  { name: 'Plain Omelette', price: 450, description: 'Egg, tomato, chili, onion, sauce' },
  { name: 'Fasting Firfir', price: 300, description: 'Tomato, chili, onion, sauce, bread, cheese' },
  { name: 'French Toast', price: 430, description: 'Egg, milk, butter' },
  { name: 'Avocado Toast', price: 350, description: 'Toast bread, avocado' },
  { name: 'Special Full', price: 400, description: 'Smashed beans, eggs, diced onion, tomato, chili, yogurt, minced beef served with bread' },
  { name: 'Normal Full', price: 350, description: 'Smashed beans, diced onion, tomato, chili served with bread' },
  { name: 'Fettira Normal', price: 400 },
  { name: 'Fettira Special', price: 450 },
  { name: 'Pancake', price: 400 },
  { name: 'Special Omelette', price: 450 },
  { name: 'Quanta Firfir', price: 650 },
  { name: 'Tibs Firfir', price: 650 },
  { name: 'Normal Chechebsa', price: 400 },
  { name: 'Special Chechebsa', price: 450 },
  { name: 'Bulla Firfir', price: 350 },
  { name: 'Dullet', price: 500 },
  { name: 'Bulla Genfo with Butter', price: 450 },
];

const SOUP: MenuSeed[] = [
  { name: 'Chicken Cream Soup', price: 400 },
  { name: 'Vegetable Soup', price: 240 },
  { name: 'Mushroom Cream Soup', price: 300 },
  { name: 'Haleko/Moringa Soup', price: 250 },
  { name: 'Haleko/Moringa Cream Soup', price: 300 },
  { name: 'Fish Soup', price: 300 },
  { name: 'Minestrone Soup', price: 290 },
  { name: 'Lentil Soup', price: 280 },
  { name: 'Tomato Soup', price: 250 },
];

const SALAD: MenuSeed[] = [
  { name: 'Daros Special Salad', price: 590, description: 'Meat, chicken meat, onion, chili, garlic, mustard' },
  { name: 'Chicken Salad', price: 450, description: 'Chicken meat, onion, chili, mustard' },
  { name: 'Avocado Salad', price: 340 },
  { name: 'Tuna Salad', price: 500, description: 'Tuna, onion, chili, garlic, tomato' },
  { name: 'Mixed Salad', price: 380 },
  { name: 'Russian Salad', price: 500, description: 'Meat, egg, potato, onion, chili, mayonnaise' },
  { name: 'Tomato Salad', price: 300 },
];

const CHICKEN: MenuSeed[] = [
  { name: 'Grilled Chicken Breast', price: 900, description: 'Chicken breast, pepper, onion, garlic, rice, mixed vegetable' },
  { name: 'Fried Chicken Leg', price: 890, description: 'Chicken leg, onion, garlic, rice, mixed vegetable' },
  { name: 'Half Roasted Chicken', price: 1600, description: 'Half chicken meat, onion, garlic, butter, mixed vegetable' },
  { name: 'Stir Fried Chicken', price: 650, description: 'Chicken meat, egg, onion, garlic, rice, mixed vegetable' },
  { name: 'Chicken Curry', price: 890, description: 'Chicken meat, onion, garlic, pepper, butter, milk, mixed vegetable, rice' },
  { name: 'Chicken Breast with Mushroom Sauce', price: 870, description: 'Chicken breast, butter, milk, onion, garlic, mushroom' },
  { name: 'Whole Roasted Chicken', price: 3400, description: 'Full chicken meat, butter, milk, rice, mixed vegetable, garlic, onion' },
  { name: 'Daros Special Mixed Grill', price: 1290, description: 'Chicken meat, fish, butter, milk, onion, garlic, rice, mixed vegetable' },
  { name: 'Chicken Cordon Bleu', price: 1600, description: '2 chicken breast, cheese, garlic, onion, rice, cooked vegetable' },
];

const FISH: MenuSeed[] = [
  { name: 'Fish Goulash', price: 750, description: 'Fish, tomato, garlic, onion, green pepper, rice' },
  { name: 'Fish Cutlet', price: 800, description: 'Fish, onion, garlic, rice, cooked vegetable' },
  { name: 'Fish Lebleb', price: 790, description: 'Fish, garlic, onion' },
  { name: 'Grilled Nile Perch', price: 950, description: 'Nile perch fish, mustard, pepper, garlic, rice, cooked vegetable' },
  { name: 'Fried Fish (Assa Shekla)', price: 1300, description: 'Fish, garlic, onion, rice, mixed vegetable' },
  { name: 'Fish Dullet', price: 900, description: 'Fish, garlic, onion' },
  { name: 'Stir Fried Fish', price: 640, description: 'Fish, garlic, onion, rice, mixed vegetable' },
  { name: 'Grilled Salmon', price: 3160, description: 'Salmon fish, onion, garlic, roasted potato, mixed salad, rice, mixed vegetable' },
];

const BEEF: MenuSeed[] = [
  { name: 'Pepper Steak', price: 900, description: 'Beef, pepper, garlic, green beans, zucchini, broccoli' },
  { name: 'Beef Stroganoff', price: 995, description: 'Beef, butter, milk, mushroom, onion, garlic' },
  { name: 'Steak Al Albismarrk', price: 1100, description: 'Beef, egg, pepper, mixed vegetables' },
];

const PASTA: MenuSeed[] = [
  { name: 'Pasta with Tomato Sauce', price: 320, description: 'Spaghetti, rice, penne, or tagliatelle' },
  { name: 'Pasta with Tuna Sauce', price: 590 },
  { name: 'Pasta with Chicken Cream Sauce', price: 550 },
  { name: 'Pasta with Bologna Sauce', price: 510 },
  { name: 'Pasta with Vegetable Sauce', price: 350 },
  { name: 'Pasta with Arrabiata Sauce', price: 350 },
  { name: 'Lasagna', price: 780 },
];

const PIZZA: MenuSeed[] = [
  { name: 'Margarita Pizza', price: 580, description: 'Onion, garlic, cheese' },
  { name: 'Chicken Pizza', price: 800, description: 'Chicken meat, onion, garlic, cheese, tomato sauce' },
  { name: 'Vegetable Pizza', price: 400, description: 'Onion, garlic, mixed vegetable, tomato sauce' },
  { name: 'Tuna Pizza with Cheese', price: 1050, description: 'Tuna, onion, garlic, tomato sauce, cheese' },
  { name: 'Tuna Pizza', price: 750, description: 'Tuna, onion, garlic, tomato sauce' },
  { name: 'Daros Special Pizza', price: 930, description: 'Meat, tuna, chicken, egg, cheese, black olive' },
  { name: 'Four Season Pizza', price: 800, description: 'Chicken mortadella, beef mortadella, tuna, mixed vegetable, cheese, tomato sauce' },
  { name: 'Meat Lover Pizza', price: 750, description: 'Meat, onion, garlic, cheese, tomato sauce' },
];

const TRADITIONAL: MenuSeed[] = [
  { name: 'Fillet Tibs', price: 850 },
  { name: 'Lamb Tibs', price: 910 },
  { name: 'Chicken Tibs', price: 950 },
  { name: 'Full Agelgil', price: 1600 },
  { name: 'Half Agelgil', price: 1050 },
  { name: 'Beyaynet', price: 400 },
  { name: 'Yetsom Agelgil Full', price: 890 },
  { name: 'Yetsom Agelgil Half', price: 520 },
  { name: 'Bulla Besiga', price: 530 },
  { name: 'Fosese', price: 330 },
  { name: 'Haleko Bekita', price: 330 },
  { name: 'Kurkufa', price: 350 },
  { name: 'Bozena Shiro', price: 480 },
  { name: 'Shiro', price: 430 },
  { name: 'Tegabino', price: 450 },
  { name: 'Shiro with Vegetable', price: 450 },
  { name: 'Bulla with Butter', price: 450 },
];

const SNACK: MenuSeed[] = [
  { name: 'Daros Special Burger', price: 750 },
  { name: 'Cheese Burger', price: 610 },
  { name: 'Beef Burger', price: 590 },
  { name: 'Chicken Burger', price: 610 },
  { name: 'Chicken Special Burger', price: 830 },
  { name: 'Club Sandwich', price: 770 },
  { name: 'Vegetable Sandwich', price: 400 },
  { name: 'Egg Sandwich', price: 420 },
  { name: 'Vegetable Wrap', price: 450 },
  { name: 'Chicken Wrap', price: 690 },
  { name: 'Tuna Wrap', price: 600 },
  { name: 'Beef Wrap', price: 590 },
  { name: 'Daros Special Wrap', price: 1050 },
  { name: 'Tuna Sandwich', price: 610 },
  { name: 'French Fries', price: 290 },
];

const DESSERT: MenuSeed[] = [
  { name: 'Fruit Platter', price: 120 },
  { name: 'Fruit Punch', price: 250 },
  { name: 'English Cake', price: 100 },
  { name: 'Cream Caramel', price: 130 },
  { name: 'Watermelon & Papaya Slice', price: 120 },
  { name: 'Watermelon & Papaya Mixed Slice', price: 120 },
];

const EXTRA: MenuSeed[] = [
  { name: 'Take Away', price: 70 },
  { name: 'Egg', price: 50 },
  { name: 'Injera', price: 30 },
  { name: 'Bread and Kitta', price: 30 },
];

const HOT_BEV: MenuSeed[] = [
  { name: 'Traditional Coffee', price: 50 },
  { name: 'Coffee with Butter', price: 70 },
  { name: 'Coffee Machine', price: 50 },
  { name: 'Coffee with Peanut', price: 70 },
  { name: 'Cappuccino', price: 100 },
  { name: 'Espresso', price: 70 },
  { name: 'Cafe Latte', price: 90 },
  { name: 'Spires (Coffee with Tea)', price: 60 },
  { name: 'American Coffee', price: 70 },
  { name: 'Hot Chocolate', price: 110 },
  { name: 'Tea', price: 50 },
  { name: 'Special Tea', price: 100 },
  { name: 'Ginger Tea', price: 60 },
  { name: 'Milk', price: 90 },
  { name: 'Macchiato', price: 80 },
  { name: 'Fasting Macchiato', price: 90 },
];

const BEVERAGES: MenuSeed[] = [
  { name: 'Soft Drink', price: 80 },
  { name: 'Ambo Water', price: 100 },
  { name: 'Water 0.5L', price: 50 },
  { name: 'Big Water 1L', price: 80 },
  { name: 'Big Water 2L', price: 100 },
  { name: 'All Drafts', price: 100 },
  { name: 'Draft Tower', price: 1200 },
  { name: 'Big Beers', price: 170 },
  { name: 'Small Beers', price: 150 },
  { name: 'Arada Beer', price: 130 },
  { name: 'Heineken Beer', price: 150 },
];

const VODKA: MenuSeed[] = [
  { name: 'Absolute Vodka', price: 450, description: 'Bottle: 14,500 ETB | Half: 7,300 ETB | Shot: 450 ETB' },
  { name: 'Ciroc Vodka', price: 19200, description: 'Bottle: 19,200 ETB' },
  { name: 'Winter Palace Vodka', price: 300, description: 'Bottle: 12,000 ETB | Half: 6,100 ETB | Shot: 300 ETB' },
  { name: 'Smirnoff Vodka', price: 300, description: 'Bottle: 8,900 ETB | Shot: 300 ETB' },
  { name: 'Grey Goose Vodka', price: 370, description: 'Bottle: 19,500 ETB | Shot: 370 ETB' },
  { name: 'Stolichnaya Vodka 1L', price: 290, description: 'Bottle: 10,800 ETB | Half: 4,200 ETB | Shot: 290 ETB' },
  { name: 'Stolichnaya Vodka 0.75L', price: 7560, description: 'Bottle: 7,560 ETB' },
];

const WINE: MenuSeed[] = [
  { name: 'Guder/Awash Wine', price: 0, description: 'Price on request' },
  { name: 'Awash Tekeshino', price: 0, description: 'Price on request' },
  { name: 'Awash Special Tekeshino', price: 0, description: 'Price on request' },
  { name: 'Axumit Wine/Kemilat', price: 0, description: 'Price on request' },
  { name: 'Gebeta White/Red', price: 0, description: 'Price on request' },
  { name: 'Acacia M.S Rose/Dry', price: 2300 },
  { name: 'Rift Valley Chardonnay Dry/White', price: 2500 },
];

const WHISKY: MenuSeed[] = [
  { name: 'Black Label', price: 380, description: 'Bottle: 13,530 ETB | Half: 7,030 ETB | Shot: 380 ETB' },
  { name: 'Red Label', price: 240, description: 'Bottle: 8,650 ETB | Half: 4,500 ETB | Shot: 240 ETB' },
  { name: 'Double Black', price: 19560, description: 'Bottle: 19,560 ETB' },
  { name: 'Gold Label', price: 21260, description: 'Bottle: 21,260 ETB' },
  { name: 'Blue Label', price: 61250, description: 'Bottle: 61,250 ETB' },
  { name: 'Jack Daniel\'s', price: 350, description: 'Bottle: 13,200 ETB | Half: 7,050 ETB | Shot: 350 ETB' },
  { name: 'Glenfiddich', price: 24510, description: 'Bottle: 24,510 ETB' },
  { name: 'Johnnie Walker 15', price: 48300, description: 'Bottle: 48,300 ETB' },
  { name: 'White Horse', price: 240, description: 'Bottle: 8,200 ETB | Shot: 240 ETB' },
  { name: 'Glam Orange', price: 22500, description: 'Bottle: 22,500 ETB' },
  { name: 'Drum Blue', price: 330, description: 'Bottle: 12,350 ETB | Shot: 330 ETB' },
  { name: 'Chivas Regal 12Y', price: 12820, description: 'Bottle: 12,820 ETB' },
];

const JUICE: MenuSeed[] = [
  { name: 'Orange Juice', price: 300 },
  { name: 'Mango Juice', price: 160 },
  { name: 'Pineapple Juice', price: 200 },
  { name: 'Papaya Juice', price: 150 },
  { name: 'Avocado Juice', price: 160 },
  { name: 'Strawberry Juice', price: 250 },
  { name: 'Mixed Juice', price: 200 },
  { name: 'Lemon Juice', price: 160 },
  { name: 'Water Melon Juice', price: 150 },
  { name: 'Banana Juice', price: 150 },
];

const SPECIAL_SMOOTHIE: MenuSeed[] = [
  {
    name: 'AKU-KOO-LU',
    price: 250,
    description: 'Lettuce, banana, avocado, milk, caramel, ice',
  },
  {
    name: 'Passion',
    price: 230,
    description: 'Mango, strawberry, banana, cinnamon, syrup, ice, milk',
  },
  {
    name: 'Ayire',
    price: 230,
    description: 'Coffee, milk, cocoa, banana, chocolate, ice',
  },
  {
    name: 'Banana Smoothie / Milk Shake',
    price: 150,
    description: 'Banana, milk, crackers, honey, ice',
  },
  {
    name: 'Mango Smoothie / Milk Shake',
    price: 230,
    description: 'Mango, milk, crackers, honey, ice',
  },
  {
    name: 'Strawberry Sunshine',
    price: 200,
    description: 'Strawberry, banana, peanut, milk, syrup, ice',
  },
  {
    name: 'Special Smoothie',
    price: 300,
    description:
      'Strawberry, mango, banana, flax seed, peanut, chocolate, caramel, strawberry syrup, ice',
  },
];

export const SOBANA_MENU_ITEMS: MenuItem[] = [
  ...buildItems(C.breakfast, 'breakfast', BREAKFAST),
  ...buildItems(C.soup, 'soup', SOUP),
  ...buildItems(C.salad, 'salad', SALAD),
  ...buildItems(C.chicken, 'chicken', CHICKEN),
  ...buildItems(C.fish, 'fish', FISH),
  ...buildItems(C.beef, 'beef', BEEF),
  ...buildItems(C.pasta, 'pasta', PASTA),
  ...buildItems(C.pizza, 'pizza', PIZZA),
  ...buildItems(C.traditional, 'traditional', TRADITIONAL),
  ...buildItems(C.snack, 'snack', SNACK),
  ...buildItems(C.dessert, 'dessert', DESSERT),
  ...buildItems(C.extra, 'extra', EXTRA),
  ...buildItems(C.juice, 'juice', JUICE),
  ...buildItems(C.smoothie, 'smoothie', SPECIAL_SMOOTHIE),
  ...buildItems(C.hotBev, 'hot-bev', HOT_BEV),
  ...buildItems(C.beverages, 'bev', BEVERAGES),
  ...buildItems(C.vodka, 'vodka', VODKA),
  ...buildItems(C.wine, 'wine', WINE.filter((w) => w.price > 0)),
  ...buildItems(C.whisky, 'whisky', WHISKY),
].map((menuItem) => {
  const category = SOBANA_CATEGORIES.find((c) => c.id === menuItem.category_id);
  return { ...menuItem, category };
});

export const PRICE_NOTE =
  'All prices include 15% VAT and 10% service charge.';

export function isDemoMode(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (import.meta.env.VITE_USE_DEMO === 'true') return true;
  if (!url || !key) return true;
  if (url.includes('placeholder') || key === 'placeholder-key') return true;
  return false;
}

export function getDemoRestaurantBySlug(slug: string): Restaurant | null {
  if (slug === SOBANA_RESTAURANT.slug) return SOBANA_RESTAURANT;
  return null;
}

export function getDemoCategories(restaurantId: string, activeOnly = false): Category[] {
  if (restaurantId !== SOBANA_RESTAURANT_ID) return [];
  return SOBANA_CATEGORIES.filter((c) => !activeOnly || c.status === 'active');
}

export function getDemoMenuItems(restaurantId: string, categoryId?: string): MenuItem[] {
  if (restaurantId !== SOBANA_RESTAURANT_ID) return [];
  let items = [...SOBANA_MENU_ITEMS];
  if (categoryId) items = items.filter((i) => i.category_id === categoryId);
  return items.sort((a, b) => a.display_order - b.display_order);
}

export function getDemoMenuItemById(id: string): MenuItem | null {
  return SOBANA_MENU_ITEMS.find((i) => i.id === id) || null;
}

export function searchDemoMenuItems(restaurantId: string, query: string): MenuItem[] {
  const q = query.toLowerCase();
  return getDemoMenuItems(restaurantId).filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.description?.toLowerCase().includes(q) ||
      i.category?.name.toLowerCase().includes(q)
  );
}

export function getDemoRelatedItems(itemId: string, categoryId: string, limit = 4): MenuItem[] {
  return SOBANA_MENU_ITEMS.filter(
    (i) => i.category_id === categoryId && i.id !== itemId && i.availability === 'available'
  ).slice(0, limit);
}

export function getDemoDashboardStats(restaurantId: string) {
  const items = getDemoMenuItems(restaurantId);
  const categories = getDemoCategories(restaurantId);
  return {
    totalCategories: categories.length,
    totalMenuItems: items.length,
    availableItems: items.filter((i) => i.availability === 'available').length,
    unavailableItems: items.filter((i) => i.availability === 'unavailable').length,
  };
}

export function getDemoCategoryById(id: string): Category | null {
  return SOBANA_CATEGORIES.find((c) => c.id === id) || null;
}

export function getDemoRestaurantById(id: string): Restaurant | null {
  if (id === SOBANA_RESTAURANT_ID) return SOBANA_RESTAURANT;
  return null;
}
