-- Daros Hotel Arba Minch - Complete Menu Seed Data
-- Run after 001, 002, 003 migrations

DELETE FROM menu_items WHERE restaurant_id = 'b0000000-0000-0000-0000-000000000001';
DELETE FROM categories WHERE restaurant_id = 'b0000000-0000-0000-0000-000000000001';
DELETE FROM restaurants WHERE slug = 'daros-hotel';

INSERT INTO restaurants (
  id, slug, name, description, phone, email, address, welcome_message,
  opening_hours, social_links, google_maps_url
) VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'daros-hotel',
  'Daros International Hotel',
  'Welcome to Daros Hotel Arba Minch — enjoy our full restaurant menu featuring traditional Ethiopian dishes, international cuisine, fresh seafood, pizza, pasta, and premium beverages.',
  '+251 912 549 009',
  'info@daroshotel.et',
  'Arba Minch, Ethiopia',
  'Thank you for visiting Daros Hotel — enjoy every meal.',
  '{"monday":"6:00 AM - 11:00 PM","tuesday":"6:00 AM - 11:00 PM","wednesday":"6:00 AM - 11:00 PM","thursday":"6:00 AM - 11:00 PM","friday":"6:00 AM - 12:00 AM","saturday":"6:00 AM - 12:00 AM","sunday":"7:00 AM - 11:00 PM"}',
  '{"whatsapp":"https://wa.me/251912549009"}',
  'https://maps.google.com/?q=Arba+Minch+Ethiopia'
);

-- Categories
INSERT INTO categories (id, restaurant_id, name, display_order, status) VALUES
  ('cat-breakfast', 'b0000000-0000-0000-0000-000000000001', 'Breakfast', 1, 'active'),
  ('cat-soup', 'b0000000-0000-0000-0000-000000000001', 'Soup', 2, 'active'),
  ('cat-salad', 'b0000000-0000-0000-0000-000000000001', 'Salad', 3, 'active'),
  ('cat-chicken', 'b0000000-0000-0000-0000-000000000001', 'Chicken Corner', 4, 'active'),
  ('cat-fish', 'b0000000-0000-0000-0000-000000000001', 'Fish Corner', 5, 'active'),
  ('cat-beef', 'b0000000-0000-0000-0000-000000000001', 'Beef Corner', 6, 'active'),
  ('cat-pasta', 'b0000000-0000-0000-0000-000000000001', 'Pasta Corner', 7, 'active'),
  ('cat-pizza', 'b0000000-0000-0000-0000-000000000001', 'Pizza Corner', 8, 'active'),
  ('cat-traditional', 'b0000000-0000-0000-0000-000000000001', 'Traditional Dish', 9, 'active'),
  ('cat-snack', 'b0000000-0000-0000-0000-000000000001', 'Snack and Sandwich', 10, 'active'),
  ('cat-dessert', 'b0000000-0000-0000-0000-000000000001', 'Dessert', 11, 'active'),
  ('cat-extra', 'b0000000-0000-0000-0000-000000000001', 'Extra Topping', 12, 'active'),
  ('cat-hot-beverages', 'b0000000-0000-0000-0000-000000000001', 'Hot Beverages', 13, 'active'),
  ('cat-beverages-beers', 'b0000000-0000-0000-0000-000000000001', 'Beverages & Beers', 14, 'active'),
  ('cat-vodka', 'b0000000-0000-0000-0000-000000000001', 'Vodka', 15, 'active'),
  ('cat-wine', 'b0000000-0000-0000-0000-000000000001', 'Wine', 16, 'active'),
  ('cat-whisky', 'b0000000-0000-0000-0000-000000000001', 'Whisky', 17, 'active');

-- Helper: insert menu items for a category
-- Breakfast (18 items)
INSERT INTO menu_items (id, category_id, restaurant_id, name, description, price, display_order) VALUES
  ('breakfast-1', 'cat-breakfast', 'b0000000-0000-0000-0000-000000000001', 'Oats', 'Milk, honey or syrup', 300, 1),
  ('breakfast-2', 'cat-breakfast', 'b0000000-0000-0000-0000-000000000001', 'Plain Omelette', 'Egg, tomato, chili, onion, sauce', 450, 2),
  ('breakfast-3', 'cat-breakfast', 'b0000000-0000-0000-0000-000000000001', 'Fasting Firfir', 'Tomato, chili, onion, sauce, bread, cheese', 300, 3),
  ('breakfast-4', 'cat-breakfast', 'b0000000-0000-0000-0000-000000000001', 'French Toast', 'Egg, milk, butter', 430, 4),
  ('breakfast-5', 'cat-breakfast', 'b0000000-0000-0000-0000-000000000001', 'Avocado Toast', 'Toast bread, avocado', 350, 5),
  ('breakfast-6', 'cat-breakfast', 'b0000000-0000-0000-0000-000000000001', 'Special Full', 'Smashed beans, eggs, diced onion, tomato, chili, yogurt, minced beef served with bread', 400, 6),
  ('breakfast-7', 'cat-breakfast', 'b0000000-0000-0000-0000-000000000001', 'Normal Full', 'Smashed beans, diced onion, tomato, chili served with bread', 350, 7),
  ('breakfast-8', 'cat-breakfast', 'b0000000-0000-0000-0000-000000000001', 'Fettira Normal', NULL, 400, 8),
  ('breakfast-9', 'cat-breakfast', 'b0000000-0000-0000-0000-000000000001', 'Fettira Special', NULL, 450, 9),
  ('breakfast-10', 'cat-breakfast', 'b0000000-0000-0000-0000-000000000001', 'Pancake', NULL, 400, 10),
  ('breakfast-11', 'cat-breakfast', 'b0000000-0000-0000-0000-000000000001', 'Special Omelette', NULL, 450, 11),
  ('breakfast-12', 'cat-breakfast', 'b0000000-0000-0000-0000-000000000001', 'Quanta Firfir', NULL, 650, 12),
  ('breakfast-13', 'cat-breakfast', 'b0000000-0000-0000-0000-000000000001', 'Tibs Firfir', NULL, 650, 13),
  ('breakfast-14', 'cat-breakfast', 'b0000000-0000-0000-0000-000000000001', 'Normal Chechebsa', NULL, 400, 14),
  ('breakfast-15', 'cat-breakfast', 'b0000000-0000-0000-0000-000000000001', 'Special Chechebsa', NULL, 450, 15),
  ('breakfast-16', 'cat-breakfast', 'b0000000-0000-0000-0000-000000000001', 'Bulla Firfir', NULL, 350, 16),
  ('breakfast-17', 'cat-breakfast', 'b0000000-0000-0000-0000-000000000001', 'Dullet', NULL, 500, 17),
  ('breakfast-18', 'cat-breakfast', 'b0000000-0000-0000-0000-000000000001', 'Bulla Genfo with Butter', NULL, 450, 18);

-- Soup (9 items)
INSERT INTO menu_items (category_id, restaurant_id, name, price, display_order) VALUES
  ('cat-soup', 'b0000000-0000-0000-0000-000000000001', 'Chicken Cream Soup', 400, 1),
  ('cat-soup', 'b0000000-0000-0000-0000-000000000001', 'Vegetable Soup', 240, 2),
  ('cat-soup', 'b0000000-0000-0000-0000-000000000001', 'Mushroom Cream Soup', 300, 3),
  ('cat-soup', 'b0000000-0000-0000-0000-000000000001', 'Haleko/Moringa Soup', 250, 4),
  ('cat-soup', 'b0000000-0000-0000-0000-000000000001', 'Haleko/Moringa Cream Soup', 300, 5),
  ('cat-soup', 'b0000000-0000-0000-0000-000000000001', 'Fish Soup', 300, 6),
  ('cat-soup', 'b0000000-0000-0000-0000-000000000001', 'Minestrone Soup', 290, 7),
  ('cat-soup', 'b0000000-0000-0000-0000-000000000001', 'Lentil Soup', 280, 8),
  ('cat-soup', 'b0000000-0000-0000-0000-000000000001', 'Tomato Soup', 250, 9);

-- Snack and Sandwich (15 items)
INSERT INTO menu_items (category_id, restaurant_id, name, price, display_order) VALUES
  ('cat-snack', 'b0000000-0000-0000-0000-000000000001', 'Daros Special Burger', 750, 1),
  ('cat-snack', 'b0000000-0000-0000-0000-000000000001', 'Cheese Burger', 610, 2),
  ('cat-snack', 'b0000000-0000-0000-0000-000000000001', 'Beef Burger', 590, 3),
  ('cat-snack', 'b0000000-0000-0000-0000-000000000001', 'Chicken Burger', 610, 4),
  ('cat-snack', 'b0000000-0000-0000-0000-000000000001', 'Chicken Special Burger', 830, 5),
  ('cat-snack', 'b0000000-0000-0000-0000-000000000001', 'Club Sandwich', 770, 6),
  ('cat-snack', 'b0000000-0000-0000-0000-000000000001', 'Vegetable Sandwich', 400, 7),
  ('cat-snack', 'b0000000-0000-0000-0000-000000000001', 'Egg Sandwich', 420, 8),
  ('cat-snack', 'b0000000-0000-0000-0000-000000000001', 'Vegetable Wrap', 450, 9),
  ('cat-snack', 'b0000000-0000-0000-0000-000000000001', 'Chicken Wrap', 690, 10),
  ('cat-snack', 'b0000000-0000-0000-0000-000000000001', 'Tuna Wrap', 600, 11),
  ('cat-snack', 'b0000000-0000-0000-0000-000000000001', 'Beef Wrap', 590, 12),
  ('cat-snack', 'b0000000-0000-0000-0000-000000000001', 'Daros Special Wrap', 1050, 13),
  ('cat-snack', 'b0000000-0000-0000-0000-000000000001', 'Tuna Sandwich', 610, 14),
  ('cat-snack', 'b0000000-0000-0000-0000-000000000001', 'French Fries', 290, 15);

-- Note: For production, import remaining categories from src/data/daros-menu.ts
-- or run the app in demo mode which loads all 150+ items automatically.
