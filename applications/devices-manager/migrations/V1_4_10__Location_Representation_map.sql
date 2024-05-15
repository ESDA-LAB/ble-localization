-- ----------------------------
-- Table structure for Location Map
-- ----------------------------
CREATE TABLE location_maps(
  location_id int4 NULL,
  width integer NOT NULL,
  height integer NOT NULL,
  resolution real NOT NULL,
  created_at timestamp NOT NULL,
  updated_at timestamp NULL,
  CONSTRAINT location_maps_pkey PRIMARY KEY (location_id),
  CONSTRAINT fkdo372jalocoaa32roeh41w1vxdgf0 FOREIGN KEY (location_id) REFERENCES locations(id)
);
