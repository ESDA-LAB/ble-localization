ALTER TABLE datatypes ADD COLUMN default_threshold VARCHAR(50) NULL;
UPDATE datatypes SET default_threshold='';
ALTER TABLE datatypes ALTER COLUMN default_threshold SET NOT NULL;

ALTER TABLE device_datatypes ADD COLUMN threshold VARCHAR(50) NOT NULL;
