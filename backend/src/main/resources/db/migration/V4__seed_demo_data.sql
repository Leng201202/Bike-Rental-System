-- Demo seed data for local development.
-- Demo credentials (stored as hash placeholders for future auth wiring):
--   admin / admin123
--   user  / user1234

INSERT INTO users (
    username,
    full_name,
    email,
    phone_number,
    student_id,
    role,
    password_hash,
    is_active
) VALUES
(
    'admin',
    'System Administrator',
    'demo_admin@bikerental.local',
    '+66 80-000-0000',
    'ADM-0001',
    'ADMIN',
    '{noop}admin123',
    TRUE
),
(
    'user',
    'Demo Rider',
    'demo_user@bikerental.local',
    '+66 81-111-1111',
    '64000001',
    'RIDER',
    '{noop}user1234',
    TRUE
)
ON CONFLICT (username) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    phone_number = EXCLUDED.phone_number,
    student_id = EXCLUDED.student_id,
    role = EXCLUDED.role,
    password_hash = EXCLUDED.password_hash,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

INSERT INTO user_consents (
    user_id,
    location_enabled,
    tracking_enabled,
    terms_agreed,
    terms_agreed_at,
    consent_version
)
SELECT
    u.id,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    'v1'
FROM users u
WHERE u.username = 'user'
ON CONFLICT (user_id) DO UPDATE SET
    location_enabled = EXCLUDED.location_enabled,
    tracking_enabled = EXCLUDED.tracking_enabled,
    terms_agreed = EXCLUDED.terms_agreed,
    terms_agreed_at = EXCLUDED.terms_agreed_at,
    consent_version = EXCLUDED.consent_version,
    updated_at = NOW();

INSERT INTO bikes (
    name,
    type,
    status,
    price_per_hour,
    price_per_km,
    image_url,
    description,
    current_lat,
    current_lng,
    current_zone
) VALUES
(
    'City Runner C1',
    'CITY',
    'AVAILABLE',
    15.00,
    2.00,
    'https://images.unsplash.com/photo-1559348349-86f1f65817fe?auto=format&fit=crop&q=80&w=800',
    'Comfort city bike for short campus rides.',
    20.0460,
    99.8940,
    'Library'
),
(
    'Trail Pro M2',
    'MOUNTAIN',
    'AVAILABLE',
    25.00,
    2.50,
    'https://images.unsplash.com/photo-1532298229144-0ee05051da69?auto=format&fit=crop&q=80&w=800',
    'Stable mountain bike for rough roads.',
    20.0475,
    99.8955,
    'Engineering'
),
(
    'E-Spark E3',
    'ELECTRIC',
    'RENTED',
    35.00,
    3.00,
    'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?auto=format&fit=crop&q=80&w=800',
    'Electric assist bike for quick travel.',
    20.0452,
    99.8932,
    'M-Square'
),
(
    'Road Jet R4',
    'ROAD',
    'MAINTENANCE',
    20.00,
    2.20,
    'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&q=80&w=800',
    'Road bike currently in maintenance.',
    20.0441,
    99.8964,
    'Workshop'
);

INSERT INTO rentals (
    user_id,
    bike_id,
    method,
    status,
    rental_type,
    started_at,
    ended_at,
    distance_km,
    duration_seconds,
    total_cost
)
SELECT
    u.id,
    b.id,
    'HOURLY',
    'COMPLETED',
    'IMMEDIATE',
    NOW() - INTERVAL '2 days' - INTERVAL '90 minutes',
    NOW() - INTERVAL '2 days',
    6.50,
    5400,
    37.50
FROM users u
JOIN bikes b ON b.name = 'Trail Pro M2'
WHERE u.username = 'user'
  AND NOT EXISTS (
      SELECT 1 FROM rentals r
      WHERE r.user_id = u.id
        AND r.bike_id = b.id
        AND r.status = 'COMPLETED'
  );

INSERT INTO rentals (
    user_id,
    bike_id,
    method,
    status,
    rental_type,
    started_at,
    distance_km,
    duration_seconds,
    total_cost
)
SELECT
    u.id,
    b.id,
    'MILEAGE',
    'ACTIVE',
    'IMMEDIATE',
    NOW() - INTERVAL '35 minutes',
    2.10,
    2100,
    6.30
FROM users u
JOIN bikes b ON b.name = 'E-Spark E3'
WHERE u.username = 'user'
  AND NOT EXISTS (
      SELECT 1 FROM rentals r
      WHERE r.user_id = u.id
        AND r.status IN ('RESERVED', 'ACTIVE')
  );

INSERT INTO payments (
    transaction_code,
    user_id,
    rental_id,
    amount,
    currency,
    method,
    status,
    paid_at
)
SELECT
    'TRX-DEMO-0001',
    u.id,
    r.id,
    r.total_cost,
    'THB',
    'PROMPTPAY',
    'COMPLETED',
    NOW() - INTERVAL '2 days'
FROM users u
JOIN rentals r ON r.user_id = u.id AND r.status = 'COMPLETED'
WHERE u.username = 'user'
  AND NOT EXISTS (
      SELECT 1 FROM payments p WHERE p.transaction_code = 'TRX-DEMO-0001'
  );

INSERT INTO debt_ledger (
    user_id,
    rental_id,
    entry_type,
    amount_delta,
    note
)
SELECT
    u.id,
    r.id,
    'CHARGE',
    r.total_cost,
    'Demo completed rental charge'
FROM users u
JOIN rentals r ON r.user_id = u.id AND r.status = 'COMPLETED'
WHERE u.username = 'user'
  AND NOT EXISTS (
      SELECT 1 FROM debt_ledger d
      WHERE d.user_id = u.id
        AND d.rental_id = r.id
        AND d.entry_type = 'CHARGE'
  );

INSERT INTO debt_ledger (
    user_id,
    rental_id,
    payment_id,
    entry_type,
    amount_delta,
    note
)
SELECT
    u.id,
    p.rental_id,
    p.id,
    'PAYMENT',
    -p.amount,
    'Demo payment settlement'
FROM users u
JOIN payments p ON p.user_id = u.id AND p.transaction_code = 'TRX-DEMO-0001'
WHERE u.username = 'user'
  AND NOT EXISTS (
      SELECT 1 FROM debt_ledger d
      WHERE d.payment_id = p.id
        AND d.entry_type = 'PAYMENT'
  );

INSERT INTO audit_logs (
    actor_user_id,
    action,
    target_type,
    target_id,
    detail,
    metadata_json
)
SELECT
    admin_user.id,
    'DEMO_SEED',
    'SYSTEM',
    'bootstrap',
    'Demo data seeded by Flyway migration V4',
    '{"source":"V4__seed_demo_data.sql"}'::jsonb
FROM users admin_user
WHERE admin_user.username = 'admin'
  AND NOT EXISTS (
      SELECT 1 FROM audit_logs a
      WHERE a.action = 'DEMO_SEED'
        AND a.target_id = 'bootstrap'
  );
