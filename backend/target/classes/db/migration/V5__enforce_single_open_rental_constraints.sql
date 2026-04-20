-- Ensure production databases always enforce one open rental per user and bike.
CREATE UNIQUE INDEX IF NOT EXISTS uq_rentals_single_open_per_bike
ON rentals(bike_id)
WHERE status IN ('RESERVED', 'ACTIVE');

CREATE UNIQUE INDEX IF NOT EXISTS uq_rentals_single_open_per_user
ON rentals(user_id)
WHERE status IN ('RESERVED', 'ACTIVE');
