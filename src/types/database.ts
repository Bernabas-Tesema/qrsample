export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string;
          slug: string;
          name: string;
          logo: string | null;
          banner: string | null;
          description: string | null;
          phone: string | null;
          email: string | null;
          address: string | null;
          opening_hours: Json | null;
          social_links: Json | null;
          google_maps_url: string | null;
          welcome_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          logo?: string | null;
          banner?: string | null;
          description?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          opening_hours?: Json | null;
          social_links?: Json | null;
          google_maps_url?: string | null;
          welcome_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          logo?: string | null;
          banner?: string | null;
          description?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          opening_hours?: Json | null;
          social_links?: Json | null;
          google_maps_url?: string | null;
          welcome_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          image: string | null;
          display_order: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          image?: string | null;
          display_order?: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          image?: string | null;
          display_order?: number;
          status?: string;
          created_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          category_id: string;
          restaurant_id: string;
          name: string;
          description: string | null;
          image: string | null;
          price: number;
          availability: string;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          restaurant_id: string;
          name: string;
          description?: string | null;
          image?: string | null;
          price: number;
          availability?: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          restaurant_id?: string;
          name?: string;
          description?: string | null;
          image?: string | null;
          price?: number;
          availability?: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          role: string;
          restaurant_id: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          role?: string;
          restaurant_id?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          role?: string;
          restaurant_id?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          restaurant_id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          details: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          details?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          details?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
