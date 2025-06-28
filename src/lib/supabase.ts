import { createClient } from '@supabase/supabase-js';

// For demo purposes, we'll use placeholder values
// In a real application, these would come from your Supabase project
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

// Create a mock client for demo purposes
export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: null }),
    signUp: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } }),
      }),
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    }),
  }),
};

// Database types
export interface Restaurant {
  id: string;
  name: string;
  owner_id: string;
  street_address?: string;
  city?: string;
  pincode?: string;
  gstin?: string;
  restaurant_type?: string;
  pos_system?: string;
  custom_pos_name?: string;
  number_of_outlets: number;
  goals: string[];
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  restaurant_id: string;
  email?: string;
  phone: string;
  first_name: string;
  last_name?: string;
  birthday?: string;
  anniversary?: string;
  total_visits: number;
  total_spent: number;
  last_visit?: string;
  loyalty_points: number;
  profile_completion: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  restaurant_id: string;
  customer_id?: string;
  order_number: string;
  total_amount: number;
  order_date: string;
  status: string;
  payment_method?: string;
  created_at: string;
}

export interface Campaign {
  id: string;
  restaurant_id: string;
  name: string;
  type: 'sms' | 'email' | 'whatsapp';
  status: 'draft' | 'scheduled' | 'sent' | 'completed';
  message_content: string;
  target_audience: any;
  scheduled_at?: string;
  sent_at?: string;
  total_sent: number;
  total_delivered: number;
  total_opened: number;
  total_clicked: number;
  revenue_generated: number;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyReward {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  points_required: number;
  reward_type: 'discount' | 'free_item' | 'cashback';
  reward_value: number;
  is_active: boolean;
  total_redeemed: number;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  restaurant_id: string;
  customer_id?: string;
  order_id?: string;
  rating: number;
  comment?: string;
  feedback_type: 'service' | 'food' | 'ambiance' | 'overall';
  is_public: boolean;
  created_at: string;
}

export interface QRCode {
  id: string;
  restaurant_id: string;
  name: string;
  code: string;
  type: 'feedback' | 'loyalty' | 'menu';
  target_url: string;
  scan_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreditsBalance {
  id: string;
  restaurant_id: string;
  sms_credits: number;
  email_credits: number;
  whatsapp_utility_credits: number;
  whatsapp_marketing_credits: number;
  updated_at: string;
}