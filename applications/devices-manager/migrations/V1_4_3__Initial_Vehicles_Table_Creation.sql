-- ----------------------------
-- Table structure for Vehicles
-- ----------------------------
CREATE TABLE vehicles (
  id serial NOT NULL,
  created_at timestamp NULL,
  updated_at timestamp NULL,
  owner_id int4 NOT NULL,
  label varchar(255) NULL,
  status varchar(25) NOT NULL,
  appentage_id int4 NOT NULL,
  CONSTRAINT vehicles_pkey PRIMARY KEY (id),
  CONSTRAINT fkgrtxsv3h1cl334sb5yqu7pohsg FOREIGN KEY (appentage_id) REFERENCES appendages(id)
);
