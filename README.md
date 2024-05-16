
# BLE Localization

![ESDA-Logo](/assets/esda_logo.png)

# How to run
* Clone repository
* Make sure that you have install docker engine
* Create docker network: `docker network create smart4all-net`
* Run the following: `docker compose -f compose.yaml up -d`
* Open `http://<domain>:3000`


# SQL Scripts/Samples
The following SQL scripts must run to PostgreSQL database (localization-db).

## Initialize Localization Map
```sql
UPDATE locations SET visible=true;
INSERT INTO location_maps (location_id, width, height, resolution, created_at, updated_at) VALUES (1, 550, 665, 0.05, NOW(), NOW());
```

## Create Device (Sample)
```sql
INSERT INTO network_layer (created_at) VALUES(NOW());
INSERT INTO network_layer_interfaces (interface_id, network_layer_id, urn) VALUES('BLE', (SELECT currval(pg_get_serial_sequence('network_layer', 'id'))), 'B00000000002'); -- BLE
INSERT INTO devices (created_at, "identity", status, appentage_id, network_layerid,coordinates) VALUES(NOW(), 'urn:esda:atlas:device:B00000000002', 1, 1, (SELECT currval(pg_get_serial_sequence('network_layer', 'id'))), '{"cartesian": [{"x": 0, "y": 0}]}');
```

## Create Beacons (Sample)
```sql
INSERT INTO network_layer (created_at) VALUES(NOW());
INSERT INTO network_layer_interfaces (interface_id, network_layer_id, urn) VALUES('BLE', (SELECT currval(pg_get_serial_sequence('network_layer', 'id'))), 'B00000000001'); -- BLE
INSERT INTO devices (created_at, "identity", status, appentage_id, network_layerid,coordinates) VALUES(NOW(), 'urn:esda:atlas:beacon:B00000000001', 1, 1, (SELECT currval(pg_get_serial_sequence('network_layer', 'id'))), '{"cartesian": [{"x": 2, "y": 2}]}');
---
INSERT INTO network_layer (created_at) VALUES(NOW());
INSERT INTO network_layer_interfaces (interface_id, network_layer_id, urn) VALUES('BLE', (SELECT currval(pg_get_serial_sequence('network_layer', 'id'))), 'B00000000003'); -- BLE
INSERT INTO devices (created_at, "identity", status, appentage_id, network_layerid,coordinates) VALUES(NOW(), 'urn:esda:atlas:beacon:B00000000003', 1, 1, (SELECT currval(pg_get_serial_sequence('network_layer', 'id'))), '{"cartesian": [{"x": 2, "y": -2}]}');
---
INSERT INTO network_layer (created_at) VALUES(NOW());
INSERT INTO network_layer_interfaces (interface_id, network_layer_id, urn) VALUES('BLE', (SELECT currval(pg_get_serial_sequence('network_layer', 'id'))), 'B00000000004'); -- BLE
INSERT INTO devices (created_at, "identity", status, appentage_id, network_layerid,coordinates) VALUES(NOW(), 'urn:esda:atlas:beacon:B00000000004', 1, 1, (SELECT currval(pg_get_serial_sequence('network_layer', 'id'))), '{"cartesian": [{"x": -2, "y": 2}]}');
---
INSERT INTO network_layer (created_at) VALUES(NOW());
INSERT INTO network_layer_interfaces (interface_id, network_layer_id, urn) VALUES('BLE', (SELECT currval(pg_get_serial_sequence('network_layer', 'id'))), 'B00000000005'); -- BLE
INSERT INTO devices (created_at, "identity", status, appentage_id, network_layerid,coordinates) VALUES(NOW(), 'urn:esda:atlas:beacon:B00000000005', 1, 1, (SELECT currval(pg_get_serial_sequence('network_layer', 'id'))), '{"cartesian": [{"x": -2, "y": -2}]}');
```

# Payloads

MQTT Topic: `indoor/urn:esda:atlas:device:B00000000002/presence`
```json
{
  "beacons": [
    {
      "deviceId": "urn:esda:atlas:beacon:B00000000001",
      "measurements": [-41,-49,-42,-43,-41,-49]
    },
    {
      "deviceId": "urn:esda:atlas:beacon:B00000000003",
      "measurements": [-55,-56,-50,-46,-50,-47]
    },
    {
      "deviceId": "urn:esda:atlas:beacon:B00000000004",
      "measurements": [-64,-63,-59,-65,-66,-61]
    },
    {
      "deviceId": "urn:esda:atlas:beacon:B00000000005",
      "measurements": [-76,-63,-58,-65,-58,-72]
    }
  ]
}
```

