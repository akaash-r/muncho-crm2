/*
  # Initial Muncho CRM Database Schema

  1. New Tables
    - `restaurants`
      - `id` (uuid, primary key)
      - `name` (text)
      - `owner_id` (uuid, references auth.users)
      - `street_address` (text)
      - `city` (text)
      - `pincode` (text)
      - `gstin` (text, optional)
      - `restaurant_type` (text)
      - `pos_system` (text)
      - `custom_pos_name` (text, optional)
      - `number_of_outlets` (integer)
      - `goals` (text array)
      - `onboarding_complete` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `customers`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, references restaurants)
      - `email` (text, optional)
      - `phone` (text)
      - `first_name` (text)
      - `last_name` (text, optional)
      - `birthday` (date, optional)
      - `anniversary` (date, optional)
      - `total_visits` (integer)
      - `total_spent` (decimal)
      - `last_visit` (timestamp, optional)
      - `loyalty_points` (integer)
      - `profile_completion` (integer, 0-100)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `orders`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, references restaurants)
      - `customer_id` (uuid, references customers, optional)
      - `order_number` (text)
      - `total_amount` (decimal)
      - `order_date` (timestamp)
      - `status` (text)
      - `payment_method` (text, optional)
      - `created_at` (timestamp)

    - `campaigns`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, references restaurants)
      - `name` (text)
      - `type` (text) -- 'sms', 'email', 'whatsapp'
      - `status` (text) -- 'draft', 'scheduled', 'sent', 'completed'
      - `message_content` (text)
      - `target_audience` (jsonb)
      - `scheduled_at` (timestamp, optional)
      - `sent_at` (timestamp, optional)
      - `total_sent` (integer)
      - `total_delivered` (integer)
      - `total_opened` (integer, optional)
      - `total_clicked` (integer, optional)
      - `revenue_generated` (decimal)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `loyalty_rewards`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, references restaurants)
      - `name` (text)
      - `description` (text)
      - `points_required` (integer)
      - `reward_type` (text) -- 'discount', 'free_item', 'cashback'
      - `reward_value` (decimal)
      - `is_active` (boolean)
      - `total_redeemed` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `reward_redemptions`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, references restaurants)
      - `customer_id` (uuid, references customers)
      - `reward_id` (uuid, references loyalty_rewards)
      - `points_used` (integer)
      - `order_id` (uuid, references orders, optional)
      - `redeemed_at` (timestamp)

    - `feedback`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, references restaurants)
      - `customer_id` (uuid, references customers, optional)
      - `order_id` (uuid, references orders, optional)
      - `rating` (integer) -- 1-5
      - `comment` (text, optional)
      - `feedback_type` (text) -- 'service', 'food', 'ambiance', 'overall'
      - `is_public` (boolean)
      - `created_at` (timestamp)

    - `qr_codes`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, references restaurants)
      - `name` (text)
      - `code` (text, unique)
      - `type` (text) -- 'feedback', 'loyalty', 'menu'
      - `target_url` (text)
      - `scan_count` (integer)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `credits_balance`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, references restaurants)
      - `sms_credits` (integer)
      - `email_credits` (integer)
      - `whatsapp_utility_credits` (integer)
      - `whatsapp_marketing_credits` (integer)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for restaurant owners to access their own data
    - Add policies for authenticated users to read/write their restaurant data
*/

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  street_address text,
  city text,
  pincode text,
  gstin text,
  restaurant_type text,
  pos_system text,
  custom_pos_name text,
  number_of_outlets integer DEFAULT 1,
  goals text[] DEFAULT '{}',
  onboarding_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  email text,
  phone text NOT NULL,
  first_name text NOT NULL,
  last_name text,
  birthday date,
  anniversary date,
  total_visits integer DEFAULT 0,
  total_spent decimal(10,2) DEFAULT 0,
  last_visit timestamptz,
  loyalty_points integer DEFAULT 0,
  profile_completion integer DEFAULT 0 CHECK (profile_completion >= 0 AND profile_completion <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  order_number text NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  order_date timestamptz DEFAULT now(),
  status text DEFAULT 'completed',
  payment_method text,
  created_at timestamptz DEFAULT now()
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('sms', 'email', 'whatsapp')),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'completed')),
  message_content text NOT NULL,
  target_audience jsonb DEFAULT '{}',
  scheduled_at timestamptz,
  sent_at timestamptz,
  total_sent integer DEFAULT 0,
  total_delivered integer DEFAULT 0,
  total_opened integer DEFAULT 0,
  total_clicked integer DEFAULT 0,
  revenue_generated decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create loyalty_rewards table
CREATE TABLE IF NOT EXISTS loyalty_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  points_required integer NOT NULL,
  reward_type text NOT NULL CHECK (reward_type IN ('discount', 'free_item', 'cashback')),
  reward_value decimal(10,2) NOT NULL,
  is_active boolean DEFAULT true,
  total_redeemed integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reward_redemptions table
CREATE TABLE IF NOT EXISTS reward_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  reward_id uuid REFERENCES loyalty_rewards(id) ON DELETE CASCADE,
  points_used integer NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  redeemed_at timestamptz DEFAULT now()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  feedback_type text DEFAULT 'overall' CHECK (feedback_type IN ('service', 'food', 'ambiance', 'overall')),
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create qr_codes table
CREATE TABLE IF NOT EXISTS qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('feedback', 'loyalty', 'menu')),
  target_url text NOT NULL,
  scan_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create credits_balance table
CREATE TABLE IF NOT EXISTS credits_balance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE UNIQUE,
  sms_credits integer DEFAULT 150,
  email_credits integer DEFAULT 200,
  whatsapp_utility_credits integer DEFAULT 75,
  whatsapp_marketing_credits integer DEFAULT 50,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits_balance ENABLE ROW LEVEL SECURITY;

-- Create policies for restaurants
CREATE POLICY "Users can read own restaurants"
  ON restaurants
  FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own restaurants"
  ON restaurants
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own restaurants"
  ON restaurants
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Create policies for customers
CREATE POLICY "Users can read own restaurant customers"
  ON customers
  FOR SELECT
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert customers for own restaurants"
  ON customers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update customers for own restaurants"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

-- Create policies for orders
CREATE POLICY "Users can read own restaurant orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert orders for own restaurants"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

-- Create policies for campaigns
CREATE POLICY "Users can manage own restaurant campaigns"
  ON campaigns
  FOR ALL
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

-- Create policies for loyalty_rewards
CREATE POLICY "Users can manage own restaurant rewards"
  ON loyalty_rewards
  FOR ALL
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

-- Create policies for reward_redemptions
CREATE POLICY "Users can manage own restaurant redemptions"
  ON reward_redemptions
  FOR ALL
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

-- Create policies for feedback
CREATE POLICY "Users can read own restaurant feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert feedback for own restaurants"
  ON feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

-- Create policies for qr_codes
CREATE POLICY "Users can manage own restaurant QR codes"
  ON qr_codes
  FOR ALL
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

-- Create policies for credits_balance
CREATE POLICY "Users can read own restaurant credits"
  ON credits_balance
  FOR SELECT
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own restaurant credits"
  ON credits_balance
  FOR UPDATE
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_restaurants_owner_id ON restaurants(owner_id);
CREATE INDEX IF NOT EXISTS idx_customers_restaurant_id ON customers(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_campaigns_restaurant_id ON campaigns(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_feedback_restaurant_id ON feedback(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_restaurant_id ON qr_codes(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_code ON qr_codes(code);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loyalty_rewards_updated_at
  BEFORE UPDATE ON loyalty_rewards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qr_codes_updated_at
  BEFORE UPDATE ON qr_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credits_balance_updated_at
  BEFORE UPDATE ON credits_balance
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();