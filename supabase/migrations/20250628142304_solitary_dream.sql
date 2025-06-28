/*
  # Sample Data Migration

  1. New Data
    - Sample loyalty rewards (4 rewards per restaurant)
    - Sample customers (35 customers with realistic Indian names and data)
    - Sample orders (47 orders distributed across customers)
    - Sample campaigns (4 completed campaigns per restaurant)
    - Sample feedback (89 feedback entries)
    - Sample QR codes (3 QR codes per restaurant)
    - Sample reward redemptions (25 redemptions)

  2. Data Updates
    - Update customer statistics based on actual orders
    - Update loyalty reward redemption counts
    - Update loyalty points based on spending

  3. Data Types
    - Proper date and timestamp casting for all date fields
    - Realistic Indian customer data with proper phone numbers
    - Varied order amounts and payment methods
*/

-- Insert sample loyalty rewards
INSERT INTO loyalty_rewards (restaurant_id, name, description, points_required, reward_type, reward_value, total_redeemed) 
SELECT 
  r.id,
  reward_data.name,
  reward_data.description,
  reward_data.points_required,
  reward_data.reward_type,
  reward_data.reward_value,
  reward_data.total_redeemed
FROM restaurants r
CROSS JOIN (
  SELECT 'Free Dessert' as name, 'Get any dessert from our menu absolutely free' as description, 100 as points_required, 'free_item' as reward_type, 0 as reward_value, 45 as total_redeemed
  UNION ALL
  SELECT 'Buy 1 Get 1', 'Buy one main course and get another free', 300, 'free_item', 0, 15
  UNION ALL
  SELECT '10% Off Bill', 'Get 10% discount on your total bill', 200, 'discount', 10.00, 32
  UNION ALL
  SELECT 'Free Appetizer', 'Choose any appetizer from our starter menu', 150, 'free_item', 0, 28
) AS reward_data
WHERE r.onboarding_complete = true;

-- Insert sample customers with proper date casting
INSERT INTO customers (restaurant_id, phone, first_name, last_name, email, birthday, anniversary, total_visits, total_spent, loyalty_points, profile_completion, last_visit)
SELECT 
  r.id,
  customer_data.phone,
  customer_data.first_name,
  customer_data.last_name,
  customer_data.email,
  CASE WHEN customer_data.birthday IS NOT NULL THEN customer_data.birthday::date ELSE NULL END,
  CASE WHEN customer_data.anniversary IS NOT NULL THEN customer_data.anniversary::date ELSE NULL END,
  customer_data.total_visits,
  customer_data.total_spent,
  customer_data.loyalty_points,
  customer_data.profile_completion,
  customer_data.last_visit::timestamptz
FROM restaurants r
CROSS JOIN (
  SELECT '9876543210' as phone, 'Priya' as first_name, 'Sharma' as last_name, 'priya.sharma@email.com' as email, '1990-12-28' as birthday, '2018-02-14' as anniversary, 8 as total_visits, 2450.00 as total_spent, 120 as loyalty_points, 85 as profile_completion, '2024-12-20 19:30:00+00' as last_visit
  UNION ALL
  SELECT '9123456789', 'Rahul', 'Kumar', 'rahul.k@email.com', '1985-07-15', '2020-12-30', 12, 3200.00, 180, 90, '2024-12-19 20:15:00+00'
  UNION ALL
  SELECT '9988776655', 'Anita', 'Mehta', 'anita.mehta@email.com', '1992-01-02', NULL, 5, 1800.00, 95, 70, '2024-12-18 18:45:00+00'
  UNION ALL
  SELECT '9876512345', 'Vikram', 'Patel', 'vikram.patel@email.com', '1988-03-22', '2015-01-05', 15, 4500.00, 250, 95, '2024-12-21 21:00:00+00'
  UNION ALL
  SELECT '9123987654', 'Sneha', 'Reddy', 'sneha.reddy@email.com', '1995-09-10', NULL, 3, 950.00, 45, 60, '2024-12-17 19:20:00+00'
  UNION ALL
  SELECT '9876598765', 'Arjun', 'Singh', 'arjun.singh@email.com', '1987-11-05', '2019-06-18', 7, 2100.00, 110, 80, '2024-12-16 20:30:00+00'
  UNION ALL
  SELECT '9988123456', 'Kavya', 'Nair', 'kavya.nair@email.com', '1993-04-18', NULL, 4, 1200.00, 65, 75, '2024-12-15 18:00:00+00'
  UNION ALL
  SELECT '9876123987', 'Rohit', 'Gupta', 'rohit.gupta@email.com', '1991-08-25', '2021-03-12', 6, 1750.00, 85, 85, '2024-12-22 19:45:00+00'
  UNION ALL
  SELECT '9123456780', 'Deepika', 'Joshi', 'deepika.joshi@email.com', '1989-06-12', '2017-11-25', 9, 2800.00, 140, 88, '2024-12-14 20:00:00+00'
  UNION ALL
  SELECT '9876543201', 'Amit', 'Verma', 'amit.verma@email.com', '1986-10-08', NULL, 6, 1950.00, 98, 82, '2024-12-13 19:30:00+00'
  UNION ALL
  SELECT '9988776644', 'Riya', 'Kapoor', 'riya.kapoor@email.com', '1994-03-15', '2022-05-20', 4, 1400.00, 70, 78, '2024-12-12 18:15:00+00'
  UNION ALL
  SELECT '9123987655', 'Karan', 'Malhotra', 'karan.malhotra@email.com', '1990-09-03', NULL, 11, 3100.00, 165, 92, '2024-12-11 21:15:00+00'
  UNION ALL
  SELECT '9876598766', 'Pooja', 'Agarwal', 'pooja.agarwal@email.com', '1992-12-20', '2019-04-10', 7, 2200.00, 115, 85, '2024-12-10 19:00:00+00'
  UNION ALL
  SELECT '9988123457', 'Sanjay', 'Rao', 'sanjay.rao@email.com', '1987-05-28', '2016-08-15', 13, 3800.00, 200, 95, '2024-12-09 20:45:00+00'
  UNION ALL
  SELECT '9876123988', 'Meera', 'Iyer', 'meera.iyer@email.com', '1991-11-18', NULL, 5, 1650.00, 82, 75, '2024-12-08 18:30:00+00'
  UNION ALL
  SELECT '9123456781', 'Rajesh', 'Pandey', 'rajesh.pandey@email.com', '1988-02-14', '2020-07-22', 8, 2500.00, 125, 87, '2024-12-07 19:45:00+00'
  UNION ALL
  SELECT '9876543202', 'Nisha', 'Bansal', 'nisha.bansal@email.com', '1993-08-07', NULL, 6, 1850.00, 92, 80, '2024-12-06 20:30:00+00'
  UNION ALL
  SELECT '9988776645', 'Vishal', 'Chopra', 'vishal.chopra@email.com', '1985-04-25', '2018-12-05', 10, 2900.00, 155, 90, '2024-12-05 21:00:00+00'
  UNION ALL
  SELECT '9123987656', 'Swati', 'Saxena', 'swati.saxena@email.com', '1990-07-11', '2021-09-18', 7, 2100.00, 105, 83, '2024-12-04 18:45:00+00'
  UNION ALL
  SELECT '9876598767', 'Manish', 'Tiwari', 'manish.tiwari@email.com', '1989-01-30', NULL, 9, 2700.00, 135, 88, '2024-12-03 20:15:00+00'
  UNION ALL
  SELECT '9988123458', 'Priyanka', 'Sinha', 'priyanka.sinha@email.com', '1992-10-22', '2019-03-12', 5, 1750.00, 87, 77, '2024-12-02 19:30:00+00'
  UNION ALL
  SELECT '9876123989', 'Arun', 'Mishra', 'arun.mishra@email.com', '1986-12-16', '2017-06-28', 12, 3400.00, 180, 93, '2024-12-01 21:30:00+00'
  UNION ALL
  SELECT '9123456782', 'Sunita', 'Gupta', 'sunita.gupta@email.com', '1991-05-09', NULL, 6, 1900.00, 95, 81, '2024-11-30 18:00:00+00'
  UNION ALL
  SELECT '9876543203', 'Nikhil', 'Sharma', 'nikhil.sharma@email.com', '1988-09-14', '2020-11-07', 8, 2400.00, 120, 86, '2024-11-29 20:00:00+00'
  UNION ALL
  SELECT '9988776646', 'Anjali', 'Jain', 'anjali.jain@email.com', '1994-01-05', '2022-02-14', 4, 1300.00, 65, 72, '2024-11-28 19:15:00+00'
  UNION ALL
  SELECT '9123987657', 'Suresh', 'Kumar', 'suresh.kumar@email.com', '1987-06-21', NULL, 11, 3200.00, 170, 91, '2024-11-27 21:45:00+00'
  UNION ALL
  SELECT '9876598768', 'Rekha', 'Devi', 'rekha.devi@email.com', '1990-03-18', '2018-10-30', 9, 2600.00, 130, 89, '2024-11-26 20:30:00+00'
  UNION ALL
  SELECT '9988123459', 'Gaurav', 'Singh', 'gaurav.singh@email.com', '1989-11-12', '2021-01-25', 7, 2000.00, 100, 84, '2024-11-25 19:00:00+00'
  UNION ALL
  SELECT '9876123990', 'Shweta', 'Agrawal', 'shweta.agrawal@email.com', '1992-08-26', NULL, 5, 1600.00, 80, 76, '2024-11-24 18:45:00+00'
  UNION ALL
  SELECT '9123456783', 'Ramesh', 'Yadav', 'ramesh.yadav@email.com', '1985-12-03', '2016-04-18', 14, 3900.00, 210, 96, '2024-11-23 21:15:00+00'
  UNION ALL
  SELECT '9876543204', 'Kavita', 'Bhatt', 'kavita.bhatt@email.com', '1991-02-28', '2019-08-14', 6, 1800.00, 90, 79, '2024-11-22 19:30:00+00'
  UNION ALL
  SELECT '9988776647', 'Ashok', 'Patel', 'ashok.patel@email.com', '1988-07-15', NULL, 10, 2800.00, 145, 87, '2024-11-21 20:45:00+00'
  UNION ALL
  SELECT '9123987658', 'Geeta', 'Reddy', 'geeta.reddy@email.com', '1993-04-02', '2020-12-22', 8, 2300.00, 115, 85, '2024-11-20 18:30:00+00'
  UNION ALL
  SELECT '9876598769', 'Manoj', 'Joshi', 'manoj.joshi@email.com', '1987-10-19', '2018-05-11', 12, 3300.00, 175, 92, '2024-11-19 21:00:00+00'
  UNION ALL
  SELECT '9988123460', 'Seema', 'Nair', 'seema.nair@email.com', '1990-01-24', NULL, 7, 2100.00, 105, 83, '2024-11-18 19:45:00+00'
) AS customer_data
WHERE r.onboarding_complete = true;

-- Insert sample orders with proper timestamp casting
DO $$
DECLARE
    customer_record RECORD;
    order_counter INTEGER := 1;
    order_amounts DECIMAL[] := ARRAY[450.00, 320.00, 680.00, 520.00, 380.00, 750.00, 290.00, 610.00, 425.00, 365.00, 
                                   580.00, 340.00, 720.00, 395.00, 485.00, 630.00, 275.00, 550.00, 410.00, 690.00,
                                   315.00, 525.00, 445.00, 375.00, 665.00, 295.00, 595.00, 435.00, 385.00, 715.00,
                                   325.00, 505.00, 465.00, 355.00, 645.00, 285.00, 575.00, 415.00, 395.00, 685.00,
                                   305.00, 535.00, 455.00, 345.00, 625.00, 275.00, 565.00];
    payment_methods TEXT[] := ARRAY['card', 'cash', 'upi'];
    order_dates TIMESTAMPTZ[] := ARRAY[
        '2024-12-22 19:30:00+00'::timestamptz, '2024-12-21 20:15:00+00'::timestamptz, '2024-12-20 18:45:00+00'::timestamptz,
        '2024-12-19 21:00:00+00'::timestamptz, '2024-12-18 19:20:00+00'::timestamptz, '2024-12-17 20:30:00+00'::timestamptz,
        '2024-12-16 18:00:00+00'::timestamptz, '2024-12-15 19:45:00+00'::timestamptz, '2024-12-14 20:00:00+00'::timestamptz,
        '2024-12-13 19:30:00+00'::timestamptz, '2024-12-12 18:15:00+00'::timestamptz, '2024-12-11 21:15:00+00'::timestamptz,
        '2024-12-10 19:00:00+00'::timestamptz, '2024-12-09 20:45:00+00'::timestamptz, '2024-12-08 18:30:00+00'::timestamptz,
        '2024-12-07 19:45:00+00'::timestamptz, '2024-12-06 20:30:00+00'::timestamptz, '2024-12-05 21:00:00+00'::timestamptz,
        '2024-12-04 18:45:00+00'::timestamptz, '2024-12-03 20:15:00+00'::timestamptz, '2024-12-02 19:30:00+00'::timestamptz,
        '2024-12-01 21:30:00+00'::timestamptz, '2024-11-30 18:00:00+00'::timestamptz, '2024-11-29 20:00:00+00'::timestamptz,
        '2024-11-28 19:15:00+00'::timestamptz, '2024-11-27 21:45:00+00'::timestamptz, '2024-11-26 20:30:00+00'::timestamptz,
        '2024-11-25 19:00:00+00'::timestamptz, '2024-11-24 18:45:00+00'::timestamptz, '2024-11-23 21:15:00+00'::timestamptz,
        '2024-11-22 19:30:00+00'::timestamptz, '2024-11-21 20:45:00+00'::timestamptz, '2024-11-20 18:30:00+00'::timestamptz,
        '2024-11-19 21:00:00+00'::timestamptz, '2024-11-18 19:45:00+00'::timestamptz, '2024-11-17 20:15:00+00'::timestamptz,
        '2024-11-16 18:30:00+00'::timestamptz, '2024-11-15 19:45:00+00'::timestamptz, '2024-11-14 21:00:00+00'::timestamptz,
        '2024-11-13 20:30:00+00'::timestamptz, '2024-11-12 19:15:00+00'::timestamptz, '2024-11-11 18:45:00+00'::timestamptz,
        '2024-11-10 20:00:00+00'::timestamptz, '2024-11-09 19:30:00+00'::timestamptz, '2024-11-08 21:15:00+00'::timestamptz,
        '2024-11-07 18:45:00+00'::timestamptz, '2024-11-06 20:30:00+00'::timestamptz, '2024-11-05 19:00:00+00'::timestamptz
    ];
BEGIN
    FOR customer_record IN 
        SELECT id, restaurant_id, total_visits 
        FROM customers 
        WHERE total_visits > 0 
        ORDER BY RANDOM()
    LOOP
        FOR i IN 1..LEAST(customer_record.total_visits, 3) LOOP
            IF order_counter <= 47 THEN
                INSERT INTO orders (restaurant_id, customer_id, order_number, total_amount, order_date, status, payment_method)
                VALUES (
                    customer_record.restaurant_id,
                    customer_record.id,
                    'ORD-' || LPAD(order_counter::text, 4, '0'),
                    order_amounts[((order_counter - 1) % array_length(order_amounts, 1)) + 1],
                    order_dates[((order_counter - 1) % array_length(order_dates, 1)) + 1],
                    'completed',
                    payment_methods[((order_counter - 1) % array_length(payment_methods, 1)) + 1]
                );
                order_counter := order_counter + 1;
            END IF;
        END LOOP;
        
        IF order_counter > 47 THEN
            EXIT;
        END IF;
    END LOOP;
END $$;

-- Insert sample campaigns with proper timestamp casting
INSERT INTO campaigns (restaurant_id, name, type, status, message_content, total_sent, total_delivered, total_opened, total_clicked, revenue_generated, sent_at)
SELECT 
  r.id,
  campaign_data.name,
  campaign_data.type,
  'completed',
  campaign_data.message_content,
  campaign_data.total_sent,
  campaign_data.total_delivered,
  campaign_data.total_opened,
  campaign_data.total_clicked,
  campaign_data.revenue_generated,
  campaign_data.sent_at::timestamptz
FROM restaurants r
CROSS JOIN (
  SELECT 'Weekend Special Offer' as name, 'sms' as type, 'Hi! Enjoy 20% off on all main courses this weekend. Valid till Sunday. Show this message at checkout.' as message_content, 450 as total_sent, 445 as total_delivered, 180 as total_opened, 45 as total_clicked, 2800.00 as revenue_generated, '2024-12-20 10:00:00+00' as sent_at
  UNION ALL
  SELECT 'Birthday Celebration', 'email', 'Happy Birthday! Celebrate with us and get a complimentary dessert on your special day.', 35, 34, 28, 12, 1200.00, '2024-12-18 09:00:00+00'
  UNION ALL
  SELECT 'New Menu Launch', 'whatsapp', 'Exciting news! Try our new fusion menu items. Book a table now and get 15% off.', 320, 315, 95, 28, 3500.00, '2024-12-15 11:00:00+00'
  UNION ALL
  SELECT 'Loyalty Points Reminder', 'sms', 'You have 150 loyalty points! Redeem them for exciting rewards. Visit us soon!', 180, 175, 65, 18, 1400.00, '2024-12-12 14:00:00+00'
) AS campaign_data
WHERE r.onboarding_complete = true;

-- Insert sample feedback with proper timestamp casting
INSERT INTO feedback (restaurant_id, customer_id, rating, comment, feedback_type, created_at)
SELECT 
  c.restaurant_id,
  c.id,
  feedback_data.rating,
  feedback_data.comment,
  feedback_data.feedback_type,
  feedback_data.created_at::timestamptz
FROM customers c
CROSS JOIN (
  SELECT 5 as rating, 'Excellent food and service! The ambiance was perfect for our anniversary dinner.' as comment, 'overall' as feedback_type, '2024-12-21 22:00:00+00' as created_at
  UNION ALL
  SELECT 4, 'Great taste but service was a bit slow during peak hours.', 'service', '2024-12-20 21:30:00+00'
  UNION ALL
  SELECT 5, 'Amazing new fusion dishes! Loved the creativity in presentation.', 'food', '2024-12-19 20:45:00+00'
  UNION ALL
  SELECT 4, 'Good food quality, nice atmosphere. Will definitely come back.', 'overall', '2024-12-18 19:15:00+00'
  UNION ALL
  SELECT 3, 'Food was okay but could be better. Service was friendly though.', 'food', '2024-12-17 18:30:00+00'
  UNION ALL
  SELECT 5, 'Outstanding experience! Every dish was perfectly prepared.', 'food', '2024-12-16 21:00:00+00'
  UNION ALL
  SELECT 4, 'Lovely ambiance and good food. Perfect for family dining.', 'ambiance', '2024-12-15 20:15:00+00'
  UNION ALL
  SELECT 5, 'Best restaurant in the area! Highly recommend the chef special.', 'food', '2024-12-14 19:30:00+00'
  UNION ALL
  SELECT 4, 'Nice place for celebrations. Staff was very accommodating.', 'service', '2024-12-13 20:45:00+00'
  UNION ALL
  SELECT 3, 'Average experience. Food was good but nothing extraordinary.', 'overall', '2024-12-12 18:15:00+00'
) AS feedback_data
WHERE c.total_visits > 2
LIMIT 89;

-- Insert sample QR codes
INSERT INTO qr_codes (restaurant_id, name, code, type, target_url, scan_count)
SELECT 
  r.id,
  qr_data.name,
  qr_data.code,
  qr_data.type,
  qr_data.target_url,
  qr_data.scan_count
FROM restaurants r
CROSS JOIN (
  SELECT 'Table Feedback QR' as name, 'QR-FEEDBACK-001' as code, 'feedback' as type, 'https://muncho.app/feedback/table-1' as target_url, 156 as scan_count
  UNION ALL
  SELECT 'Loyalty Program QR', 'QR-LOYALTY-001', 'loyalty', 'https://muncho.app/loyalty/signup', 89
  UNION ALL
  SELECT 'Digital Menu QR', 'QR-MENU-001', 'menu', 'https://muncho.app/menu/digital', 234
) AS qr_data
WHERE r.onboarding_complete = true;

-- Insert sample reward redemptions with proper timestamp casting
INSERT INTO reward_redemptions (restaurant_id, customer_id, reward_id, points_used, redeemed_at)
SELECT 
  c.restaurant_id,
  c.id,
  lr.id,
  lr.points_required,
  redemption_data.redeemed_at::timestamptz
FROM customers c
JOIN loyalty_rewards lr ON lr.restaurant_id = c.restaurant_id
CROSS JOIN (
  SELECT '2024-12-20 19:30:00+00' as redeemed_at
  UNION ALL
  SELECT '2024-12-19 20:15:00+00'
  UNION ALL
  SELECT '2024-12-18 18:45:00+00'
  UNION ALL
  SELECT '2024-12-17 21:00:00+00'
  UNION ALL
  SELECT '2024-12-16 19:20:00+00'
  UNION ALL
  SELECT '2024-12-15 20:30:00+00'
  UNION ALL
  SELECT '2024-12-14 18:00:00+00'
  UNION ALL
  SELECT '2024-12-13 19:45:00+00'
) AS redemption_data
WHERE c.loyalty_points >= lr.points_required
AND RANDOM() < 0.4
LIMIT 25;

-- Update customer visit counts and spending based on actual orders
UPDATE customers 
SET 
  total_visits = COALESCE((
    SELECT COUNT(*) 
    FROM orders 
    WHERE orders.customer_id = customers.id
  ), 0),
  total_spent = COALESCE((
    SELECT SUM(total_amount) 
    FROM orders 
    WHERE orders.customer_id = customers.id
  ), 0),
  last_visit = (
    SELECT MAX(order_date) 
    FROM orders 
    WHERE orders.customer_id = customers.id
  );

-- Update loyalty reward redemption counts based on actual redemptions
UPDATE loyalty_rewards 
SET total_redeemed = COALESCE((
  SELECT COUNT(*) 
  FROM reward_redemptions 
  WHERE reward_redemptions.reward_id = loyalty_rewards.id
), 0);

-- Update loyalty points based on spending (1 point per ₹10 spent)
UPDATE customers 
SET loyalty_points = FLOOR(total_spent / 10)::INTEGER
WHERE total_spent > 0;