CREATE TYPE user_role AS ENUM ('ADMIN', 'RIDER');
CREATE TYPE bike_type AS ENUM ('CITY', 'MOUNTAIN', 'ROAD', 'ELECTRIC');
CREATE TYPE bike_status AS ENUM ('AVAILABLE', 'RESERVED', 'RENTED', 'MAINTENANCE');
CREATE TYPE rental_method AS ENUM ('HOURLY', 'MILEAGE');
CREATE TYPE rental_status AS ENUM ('RESERVED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'EXPIRED');
CREATE TYPE rental_type AS ENUM ('IMMEDIATE', 'RESERVE_30_MIN');
CREATE TYPE unlock_mode AS ENUM ('STRICT_CODE', 'PROXIMITY_ONLY', 'STAFF_OVERRIDE');
CREATE TYPE location_source AS ENUM ('SYSTEM', 'RIDER_APP', 'ADMIN_UPDATE');
CREATE TYPE payment_method AS ENUM ('PROMPTPAY', 'CARD', 'CASH', 'OTHER');
CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
CREATE TYPE debt_entry_type AS ENUM ('CHARGE', 'PAYMENT', 'ADJUSTMENT', 'PENALTY', 'WAIVER');
CREATE TYPE notification_type AS ENUM ('DEBT_REMINDER', 'SYSTEM_ALERT', 'RENTAL_EVENT');
CREATE TYPE notification_channel AS ENUM ('EMAIL', 'IN_APP', 'SMS');
CREATE TYPE notification_status AS ENUM ('QUEUED', 'SENT', 'FAILED');

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    phone_number VARCHAR(50),
    campus_id VARCHAR(100) UNIQUE,
    role user_role NOT NULL,
    password_hash VARCHAR(255),
    avatar_url TEXT,
    member_since TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deactivated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_consents (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    location_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    tracking_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    terms_agreed BOOLEAN NOT NULL DEFAULT FALSE,
    terms_agreed_at TIMESTAMPTZ,
    consent_version VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE bikes (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type bike_type NOT NULL,
    status bike_status NOT NULL DEFAULT 'AVAILABLE',
    price_per_hour NUMERIC(10,2) NOT NULL DEFAULT 0,
    price_per_km NUMERIC(10,2) NOT NULL DEFAULT 0,
    image_url TEXT,
    description TEXT,
    current_lat NUMERIC(10,7),
    current_lng NUMERIC(10,7),
    current_zone VARCHAR(200),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_bikes_lat CHECK (current_lat IS NULL OR (current_lat >= -90 AND current_lat <= 90)),
    CONSTRAINT chk_bikes_lng CHECK (current_lng IS NULL OR (current_lng >= -180 AND current_lng <= 180))
);

CREATE TABLE rentals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    bike_id BIGINT NOT NULL REFERENCES bikes(id),
    method rental_method NOT NULL,
    status rental_status NOT NULL,
    rental_type rental_type NOT NULL,
    reserved_at TIMESTAMPTZ,
    reservation_ends_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    unlocked_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    unlock_code_hash VARCHAR(255),
    unlock_mode unlock_mode,
    start_lat NUMERIC(10,7),
    start_lng NUMERIC(10,7),
    end_lat NUMERIC(10,7),
    end_lng NUMERIC(10,7),
    distance_km NUMERIC(10,2) NOT NULL DEFAULT 0,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    current_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_rental_start_lat CHECK (start_lat IS NULL OR (start_lat >= -90 AND start_lat <= 90)),
    CONSTRAINT chk_rental_start_lng CHECK (start_lng IS NULL OR (start_lng >= -180 AND start_lng <= 180)),
    CONSTRAINT chk_rental_end_lat CHECK (end_lat IS NULL OR (end_lat >= -90 AND end_lat <= 90)),
    CONSTRAINT chk_rental_end_lng CHECK (end_lng IS NULL OR (end_lng >= -180 AND end_lng <= 180))
);

CREATE TABLE rental_route_points (
    id BIGSERIAL PRIMARY KEY,
    rental_id BIGINT NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
    seq_no INTEGER NOT NULL,
    lat NUMERIC(10,7) NOT NULL,
    lng NUMERIC(10,7) NOT NULL,
    point_name VARCHAR(200),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_route_lat CHECK (lat >= -90 AND lat <= 90),
    CONSTRAINT chk_route_lng CHECK (lng >= -180 AND lng <= 180)
);

CREATE TABLE bike_location_history (
    id BIGSERIAL PRIMARY KEY,
    bike_id BIGINT NOT NULL REFERENCES bikes(id) ON DELETE CASCADE,
    rental_id BIGINT REFERENCES rentals(id) ON DELETE SET NULL,
    lat NUMERIC(10,7) NOT NULL,
    lng NUMERIC(10,7) NOT NULL,
    zone VARCHAR(200),
    source location_source NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_history_lat CHECK (lat >= -90 AND lat <= 90),
    CONSTRAINT chk_history_lng CHECK (lng >= -180 AND lng <= 180)
);

CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    transaction_code VARCHAR(100) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id),
    rental_id BIGINT REFERENCES rentals(id) ON DELETE SET NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'THB',
    method payment_method NOT NULL,
    status payment_status NOT NULL,
    provider_ref VARCHAR(255),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE debt_ledger (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    rental_id BIGINT REFERENCES rentals(id) ON DELETE SET NULL,
    payment_id BIGINT REFERENCES payments(id) ON DELETE SET NULL,
    entry_type debt_entry_type NOT NULL,
    amount_delta NUMERIC(10,2) NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(120) NOT NULL,
    target_type VARCHAR(120),
    target_id VARCHAR(120),
    detail TEXT,
    metadata_json JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    channel notification_channel NOT NULL,
    subject VARCHAR(255),
    body TEXT NOT NULL,
    status notification_status NOT NULL,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rentals_user_status_created ON rentals(user_id, status, created_at);
CREATE INDEX idx_rentals_bike_status_created ON rentals(bike_id, status, created_at);
CREATE INDEX idx_payments_user_status_created ON payments(user_id, status, created_at);
CREATE INDEX idx_debt_ledger_user_created ON debt_ledger(user_id, created_at);
CREATE INDEX idx_audit_logs_created_action ON audit_logs(created_at, action);
CREATE INDEX idx_bike_location_history_bike_recorded ON bike_location_history(bike_id, recorded_at);
CREATE INDEX idx_rental_route_points_rental_seq ON rental_route_points(rental_id, seq_no);

-- Enforce at most one non-terminal rental per bike.
CREATE UNIQUE INDEX uq_rentals_single_open_per_bike
ON rentals(bike_id)
WHERE status IN ('RESERVED', 'ACTIVE');

-- Optional policy: at most one non-terminal rental per rider.
CREATE UNIQUE INDEX uq_rentals_single_open_per_user
ON rentals(user_id)
WHERE status IN ('RESERVED', 'ACTIVE');
