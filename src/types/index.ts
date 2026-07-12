export type UserRole = 'admin' | 'staff';

export type AvailabilityStatus = 'available' | 'unavailable';

export type CategoryStatus = 'active' | 'inactive';

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
  whatsapp?: string;
}

export interface OpeningHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  logo: string | null;
  banner: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  opening_hours: OpeningHours | null;
  social_links: SocialLinks | null;
  google_maps_url: string | null;
  welcome_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  image: string | null;
  display_order: number;
  status: CategoryStatus;
  created_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
  availability: AvailabilityStatus;
  display_order: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  restaurant_id: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  restaurant_id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: string | null;
  created_at: string;
}

export interface DashboardStats {
  totalCategories: number;
  totalMenuItems: number;
  availableItems: number;
  unavailableItems: number;
}

export interface RestaurantFormData {
  name: string;
  slug: string;
  logo?: string;
  banner?: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  welcome_message: string;
  google_maps_url: string;
  opening_hours: OpeningHours;
  social_links: SocialLinks;
}

export interface CategoryFormData {
  name: string;
  image: string;
  display_order: number;
  status: CategoryStatus;
}

export interface MenuItemFormData {
  name: string;
  description: string;
  image: string;
  price: number;
  category_id: string;
  availability: AvailabilityStatus;
  display_order: number;
}
