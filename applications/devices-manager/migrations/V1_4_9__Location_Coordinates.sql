ALTER TABLE locations ADD COLUMN coordinates jsonb NULL;
UPDATE locations set coordinates = '[]';
ALTER TABLE locations ALTER COLUMN coordinates SET NOT NULL;
