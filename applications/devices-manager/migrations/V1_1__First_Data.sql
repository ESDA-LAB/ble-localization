-- ----------------------------
--  Initial Locations
-- ----------------------------
INSERT INTO appendages (created_at) VALUES(NOW());
INSERT INTO locations ("identity", friendly_name, created_at, appendage_id) VALUES('aalhouse', 'University of Peloponnese - Patra (ESDA)', NOW(), (SELECT currval(pg_get_serial_sequence('appendages', 'id'))));
INSERT INTO location_maps (location_id, "identity", width, height, created_at) VALUES(1, 'aalhouse', 512, 512, NOW());

-- ----------------------------
--  Initial Gateways
-- ----------------------------
INSERT INTO network_layer (created_at) VALUES(NOW());
INSERT INTO network_layer_interfaces (interface_id, network_layer_id, urn) VALUES(0, (SELECT currval(pg_get_serial_sequence('network_layer', 'id'))), ''); -- WIFI
INSERT INTO network_layer_interfaces (interface_id, network_layer_id, urn) VALUES(1, (SELECT currval(pg_get_serial_sequence('network_layer', 'id'))), 'B827EBB59D80'); -- BLE
INSERT INTO gateways (created_at, "identity", status, appentage_id, network_layerid) VALUES(NOW(), 'atlas.gw001', 1, (SELECT currval(pg_get_serial_sequence('appendages', 'id'))), (SELECT currval(pg_get_serial_sequence('network_layer', 'id'))));

-- ----------------------------
--  Initial Robots
-- ----------------------------
INSERT INTO network_layer (created_at) VALUES(NOW());
INSERT INTO network_layer_interfaces (interface_id, network_layer_id, urn) VALUES(0, (SELECT currval(pg_get_serial_sequence('network_layer', 'id'))), ''); -- WIFI
INSERT INTO robots (created_at, "identity", status, appentage_id, network_layerid) VALUES(NOW(), 'urn:esda:atlas:robot:zaxarias001', 1, (SELECT currval(pg_get_serial_sequence('appendages', 'id'))), (SELECT currval(pg_get_serial_sequence('network_layer', 'id'))));