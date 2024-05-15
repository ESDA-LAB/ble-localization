ALTER TABLE vehicles ADD COLUMN compartments int2 NULL;
UPDATE vehicles set compartments = 0;
ALTER TABLE vehicles ALTER COLUMN compartments SET NOT NULL;
