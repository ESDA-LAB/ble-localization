ALTER TABLE locations ADD COLUMN indoor boolean NULL;
UPDATE locations set indoor = false;
ALTER TABLE locations ALTER COLUMN indoor SET NOT NULL;
