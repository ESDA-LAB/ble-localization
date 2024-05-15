-- ----------------------------
-- Table structure for Appendage
-- ----------------------------
CREATE TABLE appendages (
   id serial NOT NULL,
   created_at timestamp NULL,
   updated_at timestamp NULL,
   CONSTRAINT appendages_pkey PRIMARY KEY (id)
);

-- ----------------------------
-- Table structure for Locations
-- ----------------------------
CREATE TABLE locations (
      id serial NOT NULL,
      identity varchar(255) NOT NULL UNIQUE,
      friendly_name varchar(255) NOT NULL,
      created_at timestamp NULL,
      updated_at timestamp NULL,
      appendage_id int4 NULL,
      CONSTRAINT locations_pkey PRIMARY KEY (id),
      CONSTRAINT fkdo372jfqoaa23roehlw5vxdp0 FOREIGN KEY (appendage_id) REFERENCES appendages(id)
);

-- ----------------------------
-- Table structure for Location Map
-- ----------------------------
CREATE TABLE location_maps(
    id serial NOT NULL,
    location_id int4 NULL,
    identity varchar(255) NOT NULL UNIQUE,
    width integer NOT NULL,
    height integer NOT NULL,
    created_at timestamp NULL,
    updated_at timestamp NULL,
    CONSTRAINT location_maps_pkey PRIMARY KEY (id),
    CONSTRAINT fkdo372jalocoaa32roeh41w1vxdgf0 FOREIGN KEY (location_id) REFERENCES locations(id)
);

-- ----------------------------
-- Table structure for Network Layer
-- ----------------------------
CREATE TABLE network_layer (
  id serial NOT NULL,
  created_at timestamp NULL,
  updated_at timestamp NULL,
  CONSTRAINT network_layer_pkey PRIMARY KEY (id)
);

-- ----------------------------
-- Table structure for Network Layer Interfaces
-- ----------------------------
CREATE TABLE network_layer_interfaces (
     interface_id smallint NOT NULL,
     network_layer_id int4 NOT NULL,
     urn varchar(255) NULL,
     CONSTRAINT network_layer_interfaces_pkey PRIMARY KEY (interface_id, network_layer_id),
     CONSTRAINT ambientdevicesdatatypes_networklayerid_fk FOREIGN KEY (network_layer_id) REFERENCES network_layer(id)
);
-- ----------------------------
-- Table structure for Gateways
-- ----------------------------
CREATE TABLE gateways (
     id serial NOT NULL,
     created_at timestamp NULL,
     updated_at timestamp NULL,
     identity varchar(255) NULL UNIQUE,
     status int4 NULL,
     appentage_id int4 NOT NULL,
     network_layerid int4 NULL,
     CONSTRAINT gateways_pkey PRIMARY KEY (id),
     CONSTRAINT fkgrtxs85yy96unvb5yqu7pohsg FOREIGN KEY (appentage_id) REFERENCES appendages(id),
     CONSTRAINT fkgw65fwkqdd83ho5j2wgis9h39 FOREIGN KEY (network_layerid) REFERENCES network_layer(id)
);

-- ----------------------------
-- Table structure for Robots
-- ----------------------------
CREATE TABLE robots (
   id serial NOT NULL,
   created_at timestamp NULL,
   updated_at timestamp NULL,
   identity varchar(255) NULL UNIQUE,
   status int4 NULL,
   appentage_id int4 NULL,
   network_layerid int4 NULL,
   CONSTRAINT robots_pkey PRIMARY KEY (id),
   CONSTRAINT fkaysvqjh8ryx83vnfbail9i7c4 FOREIGN KEY (network_layerid) REFERENCES network_layer(id),
   CONSTRAINT fkobllbu6dmh19d63g70kw3tri5 FOREIGN KEY (appentage_id) REFERENCES appendages(id)
);

-- ----------------------------
-- Table structure for devices
-- ----------------------------
CREATE TABLE devices (
    id serial NOT NULL,
    created_at timestamp NULL,
    updated_at timestamp NULL,
    identity varchar(255) NULL UNIQUE,
    status int4 NULL,
    coordinates jsonb NULL,
    appentage_id int4 NULL,
    network_layerid int4 NULL,
    CONSTRAINT devices_pkey PRIMARY KEY (id),
    CONSTRAINT fk3s7mw8w5l7shkn26w5abxkb7v FOREIGN KEY (network_layerid) REFERENCES network_layer(id),
    CONSTRAINT fk95aedh7koi991yit8f69jm1e FOREIGN KEY (appentage_id) REFERENCES appendages(id)
);

-- ----------------------------
-- Table structure for datatypes
-- ----------------------------
CREATE TABLE datatypes (
  id serial NOT NULL,
  created_at timestamp NULL,
  updated_at timestamp NULL,
  datatype varchar(255) NULL UNIQUE,
  CONSTRAINT datatypes_pkey PRIMARY KEY (id)
);

-- ----------------------------
-- Table structure for device datatypes
-- ----------------------------
CREATE TABLE device_datatypes (
    device_id int4 NOT NULL,
    datatype_id int4 NOT NULL,
    CONSTRAINT device_datatypes_pkey PRIMARY KEY (device_id, datatype_id),
    CONSTRAINT FKh8ciramu9cc9qd13v3qcqiv4ue8a6 FOREIGN KEY (device_id) REFERENCES devices(id),
    CONSTRAINT FKhfh9dx7w3ubfdt11co1vdev94g3f FOREIGN KEY (datatype_id) REFERENCES datatypes(id)
);

-- ----------------------------
-- Table structure for location objects (Not JPA Mapped)
-- ----------------------------
CREATE TABLE location_objects (
    location_id int4 NULL,
    attached_deviceid int4 NOT NULL,
    label varchar(255) NOT NULL,
    created_at timestamp NULL,
    updated_at timestamp NULL,
    coordinates jsonb NULL, -- Latest coordinates from localization.
    CONSTRAINT location_objects_pkey PRIMARY KEY (location_id, attached_deviceid),
    CONSTRAINT FKh8ciramu9cc9qd13att3uad3vidv3qcqiv4ue8a6 FOREIGN KEY (attached_deviceid) REFERENCES devices(id),
    CONSTRAINT FKhfh9dx7w3ubfdt1loc101i41co1vdev94g3f FOREIGN KEY (location_id) REFERENCES locations(id)
);