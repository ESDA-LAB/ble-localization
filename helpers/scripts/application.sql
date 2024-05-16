UPDATE locations SET visible=true;
INSERT INTO location_maps (location_id, width, height, resolution, created_at, updated_at) VALUES (1, 550, 665, 0.05, NOW(), NOW());

-- Beacons
-- ----------------------------
--  Add Beacon
-- ----------------------------
INSERT INTO network_layer (created_at) VALUES(NOW());
INSERT INTO network_layer_interfaces (interface_id, network_layer_id, urn) VALUES('BLE', (SELECT currval(pg_get_serial_sequence('network_layer', 'id'))), 'B00000000001'); -- BLE
-- Appentage_id --> Replace with the gateway appendage_id that we want to apply.
INSERT INTO devices (created_at, "identity", status, appentage_id, network_layerid,coordinates) VALUES(NOW(), 'urn:esda:atlas:beacon:B00000000001', 1, 1, (SELECT currval(pg_get_serial_sequence('network_layer', 'id'))), '{"cartesian": [{"x": 0, "y": 0}]}');

-- Devices
-- ----------------------------
--  Add Device
-- ----------------------------
INSERT INTO network_layer (created_at) VALUES(NOW());
INSERT INTO network_layer_interfaces (interface_id, network_layer_id, urn) VALUES('BLE', (SELECT currval(pg_get_serial_sequence('network_layer', 'id'))), 'B00000000002'); -- BLE
-- Appentage_id --> Replace with the gateway appendage_id that we want to apply.
INSERT INTO devices (created_at, "identity", status, appentage_id, network_layerid,coordinates) VALUES(NOW(), 'urn:esda:atlas:device:B00000000002', 1, 1, (SELECT currval(pg_get_serial_sequence('network_layer', 'id'))), '{"cartesian": [{"x": 0, "y": 0}]}');