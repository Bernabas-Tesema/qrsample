-- Daros Hotel seed — valid UUIDs only
-- Run AFTER 001_initial_schema.sql, 002_rls_policies.sql, 003_storage.sql

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

INSERT INTO categories (id, restaurant_id, name, display_order, status) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Breakfast', 1, 'active'),
  ('c1000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Soup', 2, 'active'),
  ('c1000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Salad', 3, 'active'),
  ('c1000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'Chicken Corner', 4, 'active'),
  ('c1000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'Fish Corner', 5, 'active'),
  ('c1000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000001', 'Beef Corner', 6, 'active'),
  ('c1000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000001', 'Pasta Corner', 7, 'active'),
  ('c1000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000001', 'Pizza Corner', 8, 'active'),
  ('c1000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000001', 'Traditional Dish', 9, 'active'),
  ('c1000000-0000-0000-0000-00000000000a', 'b0000000-0000-0000-0000-000000000001', 'Snack and Sandwich', 10, 'active'),
  ('c1000000-0000-0000-0000-00000000000b', 'b0000000-0000-0000-0000-000000000001', 'Dessert', 11, 'active'),
  ('c1000000-0000-0000-0000-00000000000c', 'b0000000-0000-0000-0000-000000000001', 'Extra Topping', 12, 'active'),
  ('c1000000-0000-0000-0000-00000000000d', 'b0000000-0000-0000-0000-000000000001', 'Hot Beverages', 13, 'active'),
  ('c1000000-0000-0000-0000-00000000000e', 'b0000000-0000-0000-0000-000000000001', 'Beverages & Beers', 14, 'active'),
  ('c1000000-0000-0000-0000-00000000000f', 'b0000000-0000-0000-0000-000000000001', 'Vodka', 15, 'active'),
  ('c1000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000001', 'Wine', 16, 'active'),
  ('c1000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000001', 'Whisky', 17, 'active');

-- Sample breakfast items (add more from admin or full seed later)
INSERT INTO menu_items (category_id, restaurant_id, name, description, price, availability, display_order) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Oats', 'Milk, honey or syrup', 300, 'available', 1),
  ('c1000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Plain Omelette', 'Egg, tomato, chili, onion, sauce', 450, 'available', 2),
  ('c1000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'French Toast', 'Egg, milk, butter', 430, 'available', 3),
  ('c1000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Chicken Cream Soup', NULL, 400, 'available', 1),
  ('c1000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Vegetable Soup', NULL, 240, 'available', 2),
  ('c1000000-0000-0000-0000-00000000000a', 'b0000000-0000-0000-0000-000000000001', 'Daros Special Burger', NULL, 750, 'available', 1),
  ('c1000000-0000-0000-0000-00000000000a', 'b0000000-0000-0000-0000-000000000001', 'Cheese Burger', NULL, 610, 'available', 2);
