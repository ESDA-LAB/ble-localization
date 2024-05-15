ALTER TABLE devices ADD COLUMN coordinates jsonb NULL;
UPDATE devices set coordinates = '{}';
ALTER TABLE devices ALTER COLUMN coordinates SET NOT NULL;
