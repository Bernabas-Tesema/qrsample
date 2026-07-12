/** Verified Pexels photo IDs (404s removed) */
const PEXELS = {
  breakfast: [6629973, 1092730, 958545, 9733165, 1525353, 769969, 793746, 1775043, 376464, 1049626, 1095550],
  soup: [539451, 725991, 1647163, 842571],
  salad: [1640777, 1525353, 842571, 1279330],
  chicken: [106343, 571742, 2338407],
  fish: [725991, 1049626, 842571],
  beef: [769289, 769969],
  sandwich: [792775, 551997],
  fries: [1583884],
  fruit: [1132047, 1279330],
  coffee: [312418],
  chocolate: [410648],
  tea: [4198099],
  water: [416528, 699953],
  soda: [699953, 1279330],
  beer: [1267328],
  spirits: [1304540],
  wine: [1283219],
  injera: [958545, 793746, 1775043],
} as const;

const p = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1`;

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash;
}

function pFromPool(pool: readonly number[], seed: string): string {
  return p(pool[hashSeed(seed) % pool.length]);
}

/** Foodish — reliable food photos by category */
function foodish(type: string, seed: string, max = 15): string {
  const n = (hashSeed(seed) % max) + 1;
  return `https://foodish-api.com/images/${type}/${type}${n}.jpg`;
}

export const MENU_ITEM_IMAGES: Record<string, string> = {
  // ── Breakfast ──
  'Oats': p(543730),
  'Plain Omelette': p(1092730),
  'Fasting Firfir': pFromPool(PEXELS.breakfast, 'Fasting Firfir'),
  'French Toast': p(9733165),
  'Avocado Toast': p(1525353),
  'Special Full': p(769969),
  'Normal Full': p(793746),
  'Fettira Normal': pFromPool(PEXELS.breakfast, 'Fettira Normal'),
  'Fettira Special': p(1775043),
  'Pancake': p(376464),
  'Special Omelette': pFromPool(PEXELS.breakfast, 'Special Omelette'),
  'Quanta Firfir': pFromPool(PEXELS.breakfast, 'Quanta Firfir'),
  'Tibs Firfir': foodish('butter-chicken', 'Tibs Firfir'),
  'Normal Chechebsa': pFromPool(PEXELS.breakfast, 'Normal Chechebsa'),
  'Special Chechebsa': pFromPool(PEXELS.breakfast, 'Special Chechebsa'),
  'Bulla Firfir': p(793746),
  'Dullet': foodish('butter-chicken', 'Dullet'),
  'Bulla Genfo with Butter': pFromPool(PEXELS.breakfast, 'Bulla Genfo with Butter'),

  // ── Soup ──
  'Chicken Cream Soup': pFromPool(PEXELS.soup, 'Chicken Cream Soup'),
  'Vegetable Soup': pFromPool(PEXELS.soup, 'Vegetable Soup'),
  'Mushroom Cream Soup': pFromPool(PEXELS.soup, 'Mushroom Cream Soup'),
  'Haleko/Moringa Soup': pFromPool(PEXELS.soup, 'Haleko/Moringa Soup'),
  'Haleko/Moringa Cream Soup': pFromPool(PEXELS.soup, 'Haleko/Moringa Cream Soup'),
  'Fish Soup': p(725991),
  'Minestrone Soup': pFromPool(PEXELS.soup, 'Minestrone Soup'),
  'Lentil Soup': pFromPool(PEXELS.soup, 'Lentil Soup'),
  'Tomato Soup': pFromPool(PEXELS.soup, 'Tomato Soup'),

  // ── Salad ──
  'Daros Special Salad': pFromPool(PEXELS.salad, 'Daros Special Salad'),
  'Chicken Salad': pFromPool(PEXELS.salad, 'Chicken Salad'),
  'Avocado Salad': p(1525353),
  'Tuna Salad': pFromPool(PEXELS.salad, 'Tuna Salad'),
  'Mixed Salad': pFromPool(PEXELS.salad, 'Mixed Salad'),
  'Russian Salad': pFromPool(PEXELS.salad, 'Russian Salad'),
  'Tomato Salad': pFromPool(PEXELS.salad, 'Tomato Salad'),

  // ── Chicken Corner ──
  'Grilled Chicken Breast': foodish('butter-chicken', 'Grilled Chicken Breast'),
  'Fried Chicken Leg': foodish('butter-chicken', 'Fried Chicken Leg'),
  'Half Roasted Chicken': foodish('butter-chicken', 'Half Roasted Chicken'),
  'Stir Fried Chicken': foodish('butter-chicken', 'Stir Fried Chicken'),
  'Chicken Curry': foodish('butter-chicken', 'Chicken Curry'),
  'Chicken Breast with Mushroom Sauce': foodish('butter-chicken', 'Chicken Breast with Mushroom Sauce'),
  'Whole Roasted Chicken': foodish('butter-chicken', 'Whole Roasted Chicken'),
  'Daros Special Mixed Grill': foodish('biryani', 'Daros Special Mixed Grill'),
  'Chicken Cordon Bleu': pFromPool(PEXELS.chicken, 'Chicken Cordon Bleu'),

  // ── Fish Corner ──
  'Fish Goulash': pFromPool(PEXELS.fish, 'Fish Goulash'),
  'Fish Cutlet': pFromPool(PEXELS.fish, 'Fish Cutlet'),
  'Fish Lebleb': pFromPool(PEXELS.fish, 'Fish Lebleb'),
  'Grilled Nile Perch': pFromPool(PEXELS.fish, 'Grilled Nile Perch'),
  'Fried Fish (Assa Shekla)': pFromPool(PEXELS.fish, 'Fried Fish (Assa Shekla)'),
  'Fish Dullet': pFromPool(PEXELS.fish, 'Fish Dullet'),
  'Stir Fried Fish': pFromPool(PEXELS.fish, 'Stir Fried Fish'),
  'Grilled Salmon': p(725991),

  // ── Beef Corner ──
  'Pepper Steak': pFromPool(PEXELS.beef, 'Pepper Steak'),
  'Beef Stroganoff': pFromPool(PEXELS.beef, 'Beef Stroganoff'),
  'Steak Al Albismarrk': p(769289),

  // ── Pasta Corner ──
  'Pasta with Tomato Sauce': foodish('pasta', 'Pasta with Tomato Sauce'),
  'Pasta with Tuna Sauce': foodish('pasta', 'Pasta with Tuna Sauce'),
  'Pasta with Chicken Cream Sauce': foodish('pasta', 'Pasta with Chicken Cream Sauce'),
  'Pasta with Bologna Sauce': foodish('pasta', 'Pasta with Bologna Sauce'),
  'Pasta with Vegetable Sauce': foodish('pasta', 'Pasta with Vegetable Sauce'),
  'Pasta with Arrabiata Sauce': foodish('pasta', 'Pasta with Arrabiata Sauce'),
  'Lasagna': foodish('pasta', 'Lasagna'),

  // ── Pizza Corner ──
  'Margarita Pizza': foodish('pizza', 'Margarita Pizza'),
  'Chicken Pizza': foodish('pizza', 'Chicken Pizza'),
  'Vegetable Pizza': foodish('pizza', 'Vegetable Pizza'),
  'Tuna Pizza with Cheese': foodish('pizza', 'Tuna Pizza with Cheese'),
  'Tuna Pizza': foodish('pizza', 'Tuna Pizza'),
  'Daros Special Pizza': foodish('pizza', 'Daros Special Pizza'),
  'Four Season Pizza': foodish('pizza', 'Four Season Pizza'),
  'Meat Lover Pizza': foodish('pizza', 'Meat Lover Pizza'),

  // ── Traditional Dish ──
  'Fillet Tibs': foodish('biryani', 'Fillet Tibs'),
  'Lamb Tibs': foodish('biryani', 'Lamb Tibs'),
  'Chicken Tibs': foodish('butter-chicken', 'Chicken Tibs'),
  'Full Agelgil': foodish('biryani', 'Full Agelgil'),
  'Half Agelgil': foodish('biryani', 'Half Agelgil'),
  'Beyaynet': foodish('biryani', 'Beyaynet'),
  'Yetsom Agelgil Full': foodish('rice', 'Yetsom Agelgil Full'),
  'Yetsom Agelgil Half': foodish('rice', 'Yetsom Agelgil Half'),
  'Bulla Besiga': pFromPool(PEXELS.injera, 'Bulla Besiga'),
  'Fosese': foodish('rice', 'Fosese'),
  'Haleko Bekita': foodish('rice', 'Haleko Bekita'),
  'Kurkufa': foodish('rice', 'Kurkufa'),
  'Bozena Shiro': foodish('rice', 'Bozena Shiro'),
  'Shiro': foodish('rice', 'Shiro'),
  'Tegabino': foodish('rice', 'Tegabino'),
  'Shiro with Vegetable': foodish('rice', 'Shiro with Vegetable'),
  'Bulla with Butter': pFromPool(PEXELS.injera, 'Bulla with Butter'),

  // ── Snack and Sandwich ──
  'Daros Special Burger': foodish('burger', 'Daros Special Burger'),
  'Cheese Burger': foodish('burger', 'Cheese Burger'),
  'Beef Burger': foodish('burger', 'Beef Burger'),
  'Chicken Burger': foodish('burger', 'Chicken Burger'),
  'Chicken Special Burger': foodish('burger', 'Chicken Special Burger'),
  'Club Sandwich': pFromPool(PEXELS.sandwich, 'Club Sandwich'),
  'Vegetable Sandwich': pFromPool(PEXELS.sandwich, 'Vegetable Sandwich'),
  'Egg Sandwich': pFromPool(PEXELS.sandwich, 'Egg Sandwich'),
  'Vegetable Wrap': foodish('samosa', 'Vegetable Wrap'),
  'Chicken Wrap': foodish('samosa', 'Chicken Wrap'),
  'Tuna Wrap': foodish('samosa', 'Tuna Wrap'),
  'Beef Wrap': foodish('samosa', 'Beef Wrap'),
  'Daros Special Wrap': foodish('samosa', 'Daros Special Wrap'),
  'Tuna Sandwich': pFromPool(PEXELS.sandwich, 'Tuna Sandwich'),
  'French Fries': p(1583884),

  // ── Dessert ──
  'Fruit Platter': pFromPool(PEXELS.fruit, 'Fruit Platter'),
  'Fruit Punch': pFromPool(PEXELS.fruit, 'Fruit Punch'),
  'English Cake': foodish('dessert', 'English Cake'),
  'Cream Caramel': foodish('dessert', 'Cream Caramel'),
  'Watermelon & Papaya Slice': pFromPool(PEXELS.fruit, 'Watermelon & Papaya Slice'),
  'Watermelon & Papaya Mixed Slice': pFromPool(PEXELS.fruit, 'Watermelon & Papaya Mixed Slice'),

  // ── Extra Topping ──
  'Take Away': pFromPool(PEXELS.injera, 'Take Away'),
  'Egg': p(1092730),
  'Injera': p(958545),
  'Bread and Kitta': pFromPool(PEXELS.injera, 'Bread and Kitta'),

  // ── Hot Beverages ──
  'Traditional Coffee': p(312418),
  'Coffee with Butter': pFromPool(PEXELS.coffee, 'Coffee with Butter'),
  'Coffee Machine': pFromPool(PEXELS.coffee, 'Coffee Machine'),
  'Coffee with Peanut': pFromPool(PEXELS.coffee, 'Coffee with Peanut'),
  'Cappuccino': pFromPool(PEXELS.coffee, 'Cappuccino'),
  'Espresso': pFromPool(PEXELS.coffee, 'Espresso'),
  'Cafe Latte': pFromPool(PEXELS.coffee, 'Cafe Latte'),
  'Spires (Coffee with Tea)': pFromPool(PEXELS.coffee, 'Spires (Coffee with Tea)'),
  'American Coffee': pFromPool(PEXELS.coffee, 'American Coffee'),
  'Hot Chocolate': p(410648),
  'Tea': pFromPool(PEXELS.tea, 'Tea'),
  'Special Tea': pFromPool(PEXELS.tea, 'Special Tea'),
  'Ginger Tea': pFromPool(PEXELS.tea, 'Ginger Tea'),
  'Milk': p(416528),
  'Macchiato': pFromPool(PEXELS.coffee, 'Macchiato'),
  'Fasting Macchiato': pFromPool(PEXELS.coffee, 'Fasting Macchiato'),

  // ── Beverages & Beers ──
  'Soft Drink': pFromPool(PEXELS.soda, 'Soft Drink'),
  'Ambo Water': pFromPool(PEXELS.water, 'Ambo Water'),
  'Water 0.5L': p(416528),
  'Big Water 1L': pFromPool(PEXELS.water, 'Big Water 1L'),
  'Big Water 2L': pFromPool(PEXELS.water, 'Big Water 2L'),
  'All Drafts': p(1267328),
  'Draft Tower': pFromPool(PEXELS.beer, 'Draft Tower'),
  'Big Beers': pFromPool(PEXELS.beer, 'Big Beers'),
  'Small Beers': pFromPool(PEXELS.beer, 'Small Beers'),
  'Arada Beer': pFromPool(PEXELS.beer, 'Arada Beer'),
  'Heineken Beer': p(1267328),

  // ── Vodka ──
  'Absolute Vodka': pFromPool(PEXELS.spirits, 'Absolute Vodka'),
  'Ciroc Vodka': pFromPool(PEXELS.spirits, 'Ciroc Vodka'),
  'Winter Palace Vodka': pFromPool(PEXELS.spirits, 'Winter Palace Vodka'),
  'Smirnoff Vodka': pFromPool(PEXELS.spirits, 'Smirnoff Vodka'),
  'Grey Goose Vodka': pFromPool(PEXELS.spirits, 'Grey Goose Vodka'),
  'Stolichnaya Vodka 1L': pFromPool(PEXELS.spirits, 'Stolichnaya Vodka 1L'),
  'Stolichnaya Vodka 0.75L': pFromPool(PEXELS.spirits, 'Stolichnaya Vodka 0.75L'),

  // ── Wine ──
  'Guder/Awash Wine': pFromPool(PEXELS.wine, 'Guder/Awash Wine'),
  'Awash Tekeshino': pFromPool(PEXELS.wine, 'Awash Tekeshino'),
  'Awash Special Tekeshino': pFromPool(PEXELS.wine, 'Awash Special Tekeshino'),
  'Axumit Wine/Kemilat': pFromPool(PEXELS.wine, 'Axumit Wine/Kemilat'),
  'Gebeta White/Red': pFromPool(PEXELS.wine, 'Gebeta White/Red'),
  'Acacia M.S Rose/Dry': pFromPool(PEXELS.wine, 'Acacia M.S Rose/Dry'),
  'Rift Valley Chardonnay Dry/White': pFromPool(PEXELS.wine, 'Rift Valley Chardonnay Dry/White'),

  // ── Whisky ──
  'Black Label': pFromPool(PEXELS.spirits, 'Black Label'),
  'Red Label': pFromPool(PEXELS.spirits, 'Red Label'),
  'Double Black': pFromPool(PEXELS.spirits, 'Double Black'),
  'Gold Label': pFromPool(PEXELS.spirits, 'Gold Label'),
  'Blue Label': pFromPool(PEXELS.spirits, 'Blue Label'),
  "Jack Daniel's": pFromPool(PEXELS.spirits, "Jack Daniel's"),
  'Glenfiddich': pFromPool(PEXELS.spirits, 'Glenfiddich'),
  'Johnnie Walker 15': pFromPool(PEXELS.spirits, 'Johnnie Walker 15'),
  'White Horse': pFromPool(PEXELS.spirits, 'White Horse'),
  'Glam Orange': pFromPool(PEXELS.spirits, 'Glam Orange'),
  'Drum Blue': pFromPool(PEXELS.spirits, 'Drum Blue'),
  'Chivas Regal 12Y': pFromPool(PEXELS.spirits, 'Chivas Regal 12Y'),
};

const MENU_ITEM_IMAGES_LOWER = Object.fromEntries(
  Object.entries(MENU_ITEM_IMAGES).map(([name, url]) => [name.toLowerCase(), url])
);

export function getMenuItemImageByName(name: string): string | undefined {
  return MENU_ITEM_IMAGES[name] ?? MENU_ITEM_IMAGES_LOWER[name.toLowerCase()];
}

/** Category fallback images */
export const CATEGORY_IMAGES: Record<string, string> = {
  Breakfast: p(1092730),
  Soup: p(539451),
  Salad: p(1640777),
  'Chicken Corner': foodish('butter-chicken', 'chicken-corner'),
  'Fish Corner': p(725991),
  'Beef Corner': p(769289),
  'Pasta Corner': foodish('pasta', 'pasta-default'),
  'Pizza Corner': foodish('pizza', 'pizza-default'),
  'Traditional Dish': foodish('biryani', 'traditional-default'),
  'Snack and Sandwich': foodish('burger', 'burger-default'),
  Dessert: foodish('dessert', 'dessert-default'),
  'Extra Topping': p(958545),
  'Hot Beverages': p(312418),
  'Beverages & Beers': p(1267328),
  Vodka: p(1304540),
  Wine: p(1283219),
  Whisky: p(1304540),
};

export const CATEGORY_ID_TO_NAME: Record<string, string> = {
  'cat-breakfast': 'Breakfast',
  'cat-soup': 'Soup',
  'cat-salad': 'Salad',
  'cat-chicken': 'Chicken Corner',
  'cat-fish': 'Fish Corner',
  'cat-beef': 'Beef Corner',
  'cat-pasta': 'Pasta Corner',
  'cat-pizza': 'Pizza Corner',
  'cat-traditional': 'Traditional Dish',
  'cat-snack': 'Snack and Sandwich',
  'cat-dessert': 'Dessert',
  'cat-extra': 'Extra Topping',
  'cat-hot-beverages': 'Hot Beverages',
  'cat-beverages-beers': 'Beverages & Beers',
  'cat-vodka': 'Vodka',
  'cat-wine': 'Wine',
  'cat-whisky': 'Whisky',
};

export const PLACEHOLDER_IMAGE = '/images/placeholder-food.jpg';

/** Local placeholder — always loads */
export function getGuaranteedFallbackImage(_name: string): string {
  return PLACEHOLDER_IMAGE;
}
