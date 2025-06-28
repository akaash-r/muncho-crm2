/*
  # Seed Sample Data for Muncho CRM

  This migration adds sample data for demonstration purposes.
  It creates sample customers, orders, campaigns, and other data
  to populate the dashboard with realistic information.
*/

-- Insert sample loyalty rewards
INSERT INTO loyalty_rewards (restaurant_id, name, description, points_required, reward_type, reward_value, total_redeemed) 
SELECT 
  r.id,
  reward_name,
  reward_desc,
  points,
  reward_type,
  value,
  redeemed
FROM restaurants r
CROSS JOIN (
  VALUES 
    ('Free Dessert', 'Get any dessert from our menu absolutely free', 100, 'free_item', 0, 45),
    ('10% Off Bill', 'Get 10% discount on your total bill', 200, 'discount', 10, 32),
    ('Free Appetizer', 'Choose any appetizer from our starter menu', 150, 'free_item', 0, 28),
    ('Buy 1 Get 1', 'Buy one main course and get another free', 300, 'free_item', 0, 15)
) AS rewards(reward_name, reward_desc, points, reward_type, value, redeemed)
WHERE r.onboarding_complete = true;

-- Insert sample customers with realistic Indian names and phone numbers
INSERT INTO customers (restaurant_id, phone, first_name, last_name, email, birthday, anniversary, total_visits, total_spent, loyalty_points, profile_completion, last_visit)
SELECT 
  r.id,
  phone,
  first_name,
  last_name,
  email,
  birthday,
  anniversary,
  visits,
  spent,
  points,
  completion,
  last_visit
FROM restaurants r
CROSS JOIN (
  VALUES 
    ('9876543210', 'Priya', 'Sharma', 'priya.sharma@email.com', '1990-12-28', '2018-02-14', 8, 2450.00, 120, 85, '2024-12-20 19:30:00'),
    ('9123456789', 'Rahul', 'Kumar', 'rahul.k@email.com', '1985-07-15', '2020-12-30', 12, 3200.00, 180, 90, '2024-12-19 20:15:00'),
    ('9988776655', 'Anita', 'Mehta', 'anita.mehta@email.com', '1992-01-02', NULL, 5, 1800.00, 95, 70, '2024-12-18 18:45:00'),
    ('9876512345', 'Vikram', 'Patel', 'vikram.patel@email.com', '1988-03-22', '2015-01-05', 15, 4500.00, 250, 95, '2024-12-21 21:00:00'),
    ('9123987654', 'Sneha', 'Reddy', 'sneha.reddy@email.com', '1995-09-10', NULL, 3, 950.00, 45, 60, '2024-12-17 19:20:00'),
    ('9876598765', 'Arjun', 'Singh', 'arjun.singh@email.com', '1987-11-05', '2019-06-18', 7, 2100.00, 110, 80, '2024-12-16 20:30:00'),
    ('9988123456', 'Kavya', 'Nair', 'kavya.nair@email.com', '1993-04-18', NULL, 4, 1200.00, 65, 75, '2024-12-15 18:00:00'),
    ('9876123987', 'Rohit', 'Gupta', 'rohit.gupta@email.com', '1991-08-25', '2021-03-12', 6, 1750.00, 85, 85, '2024-12-22 19:45:00')
) AS customers(phone, first_name, last_name, email, birthday, anniversary, visits, spent, points, completion, last_visit)
WHERE r.onboarding_complete = true;

-- Insert sample orders
INSERT INTO orders (restaurant_id, customer_id, order_number, total_amount, order_date, status, payment_method)
SELECT 
  c.restaurant_id,
  c.id,
  'ORD-' || LPAD((ROW_NUMBER() OVER (PARTITION BY c.restaurant_id ORDER BY RANDOM()))::text, 4, '0'),
  amount,
  order_date,
  'completed',
  payment_method
FROM customers c
CROSS JOIN (
  VALUES 
    (450.00, '2024-12-22 19:30:00', 'card'),
    (320.00, '2024-12-21 20:15:00', 'cash'),
    (680.00, '2024-12-20 18:45:00', 'upi'),
    (520.00, '2024-12-19 21:00:00', 'card'),
    (380.00, '2024-12-18 19:20:00', 'cash'),
    (750.00, '2024-12-17 20:30:00', 'upi'),
    (290.00, '2024-12-16 18:00:00', 'card'),
    (610.00, '2024-12-15 19:45:00', 'upi')
) AS orders(amount, order_date, payment_method)
WHERE c.total_visits > 0
LIMIT 47; -- Match the dashboard total orders

-- Insert sample campaigns
INSERT INTO campaigns (restaurant_id, name, type, status, message_content, total_sent, total_delivered, total_opened, total_clicked, revenue_generated, sent_at)
SELECT 
  r.id,
  campaign_name,
  campaign_type,
  'completed',
  message,
  sent,
  delivered,
  opened,
  clicked,
  revenue,
  sent_date
FROM restaurants r
CROSS JOIN (
  VALUES 
    ('Weekend Special Offer', 'sms', 'Hi! Enjoy 20% off on all main courses this weekend. Valid till Sunday. Show this message at checkout.', 450, 445, 180, 45, 2800.00, '2024-12-20 10:00:00'),
    ('Birthday Celebration', 'email', 'Happy Birthday! Celebrate with us and get a complimentary dessert on your special day.', 35, 34, 28, 12, 1200.00, '2024-12-18 09:00:00'),
    ('New Menu Launch', 'whatsapp', 'Exciting news! Try our new fusion menu items. Book a table now and get 15% off.', 320, 315, 95, 28, 3500.00, '2024-12-15 11:00:00'),
    ('Loyalty Points Reminder', 'sms', 'You have 150 loyalty points! Redeem them for exciting rewards. Visit us soon!', 180, 175, 65, 18, 1400.00, '2024-12-12 14:00:00')
) AS campaigns(campaign_name, campaign_type, message, sent, delivered, opened, clicked, revenue, sent_date)
WHERE r.onboarding_complete = true;

-- Insert sample feedback
INSERT INTO feedback (restaurant_id, customer_id, rating, comment, feedback_type, created_at)
SELECT 
  c.restaurant_id,
  c.id,
  rating,
  comment,
  feedback_type,
  feedback_date
FROM customers c
CROSS JOIN (
  VALUES 
    (5, 'Excellent food and service! The ambiance was perfect for our anniversary dinner.', 'overall', '2024-12-21 22:00:00'),
    (4, 'Great taste but service was a bit slow during peak hours.', 'service', '2024-12-20 21:30:00'),
    (5, 'Amazing new fusion dishes! Loved the creativity in presentation.', 'food', '2024-12-19 20:45:00'),
    (4, 'Good food quality, nice atmosphere. Will definitely come back.', 'overall', '2024-12-18 19:15:00'),
    (3, 'Food was okay but could be better. Service was friendly though.', 'food', '2024-12-17 18:30:00'),
    (5, 'Outstanding experience! Every dish was perfectly prepared.', 'food', '2024-12-16 21:00:00'),
    (4, 'Lovely ambiance and good food. Perfect for family dining.', 'ambiance', '2024-12-15 20:15:00')
) AS feedback_data(rating, comment, feedback_type, feedback_date)
WHERE c.total_visits > 2
LIMIT 89; -- Match dashboard feedback count

-- Insert sample QR codes
INSERT INTO qr_codes (restaurant_id, name, code, type, target_url, scan_count)
SELECT 
  r.id,
  qr_name,
  qr_code,
  qr_type,
  url,
  scans
FROM restaurants r
CROSS JOIN (
  VALUES 
    ('Table Feedback QR', 'QR-FEEDBACK-001', 'feedback', 'https://muncho.app/feedback/table-1', 156),
    ('Loyalty Program QR', 'QR-LOYALTY-001', 'loyalty', 'https://muncho.app/loyalty/signup', 89),
    ('Digital Menu QR', 'QR-MENU-001', 'menu', 'https://muncho.app/menu/digital', 234)
) AS qr_data(qr_name, qr_code, qr_type, url, scans)
WHERE r.onboarding_complete = true;

-- Insert sample reward redemptions
INSERT INTO reward_redemptions (restaurant_id, customer_id, reward_id, points_used, redeemed_at)
SELECT 
  c.restaurant_id,
  c.id,
  lr.id,
  lr.points_required,
  redemption_date
FROM customers c
JOIN loyalty_rewards lr ON lr.restaurant_id = c.restaurant_id
CROSS JOIN (
  VALUES 
    ('2024-12-20 19:30:00'),
    ('2024-12-19 20:15:00'),
    ('2024-12-18 18:45:00')
) AS redemptions(redemption_date)
WHERE c.loyalty_points >= lr.points_required
AND RANDOM() < 0.3 -- 30% chance of redemption
LIMIT 25;

-- Update customer visit counts and spending based on orders
UPDATE customers 
SET 
  total_visits = (
    SELECT COUNT(*) 
    FROM orders 
    WHERE orders.customer_id = customers.id
  ),
  total_spent = (
    SELECT COALESCE(SUM(total_amount), 0) 
    FROM orders 
    WHERE orders.customer_id = customers.id
  ),
  last_visit = (
    SELECT MAX(order_date) 
    FROM orders 
    WHERE orders.customer_id = customers.id
  );

-- Update loyalty reward redemption counts
UPDATE loyalty_rewards 
SET total_redeemed = (
  SELECT COUNT(*) 
  FROM reward_redemptions 
  WHERE reward_redemptions.reward_id = loyalty_rewards.id
);