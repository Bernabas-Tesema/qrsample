-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is admin for restaurant
CREATE OR REPLACE FUNCTION is_restaurant_admin(restaurant_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'staff')
    AND (restaurant_id = restaurant_uuid OR restaurant_id IS NULL)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RESTAURANTS policies
-- Public read access for customer menu
CREATE POLICY "Public can view restaurants"
  ON restaurants FOR SELECT
  USING (true);

-- Admins can update their restaurant
CREATE POLICY "Admins can update restaurant"
  ON restaurants FOR UPDATE
  USING (is_restaurant_admin(id));

CREATE POLICY "Admins can insert restaurant"
  ON restaurants FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- PROFILES policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- CATEGORIES policies
-- Public read for active categories
CREATE POLICY "Public can view active categories"
  ON categories FOR SELECT
  USING (status = 'active' OR is_restaurant_admin(restaurant_id));

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (is_restaurant_admin(restaurant_id));

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  USING (is_restaurant_admin(restaurant_id));

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  USING (is_restaurant_admin(restaurant_id));

-- MENU ITEMS policies
-- Public read for all menu items (availability shown in UI)
CREATE POLICY "Public can view menu items"
  ON menu_items FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert menu items"
  ON menu_items FOR INSERT
  WITH CHECK (is_restaurant_admin(restaurant_id));

CREATE POLICY "Admins can update menu items"
  ON menu_items FOR UPDATE
  USING (is_restaurant_admin(restaurant_id));

CREATE POLICY "Admins can delete menu items"
  ON menu_items FOR DELETE
  USING (is_restaurant_admin(restaurant_id));

-- ACTIVITY LOGS policies
CREATE POLICY "Admins can view activity logs"
  ON activity_logs FOR SELECT
  USING (is_restaurant_admin(restaurant_id));

CREATE POLICY "Admins can insert activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (is_restaurant_admin(restaurant_id));
