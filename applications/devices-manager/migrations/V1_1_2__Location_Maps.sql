/**
  Alter table location_maps
 */
ALTER TABLE location_maps ADD COLUMN map_type int4 NOT NULL DEFAULT '1';
ALTER TABLE location_maps ADD COLUMN resolution real NOT NULL DEFAULT '0.05';

/**
  Update Queries
 */
UPDATE location_maps SET map_type=1, resolution=0.05;
