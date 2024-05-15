ALTER TABLE network_layer_interfaces ALTER COLUMN interface_id TYPE VARCHAR(25);
ALTER TABLE network_layer_interfaces ALTER COLUMN interface_id SET NOT NULL;

UPDATE network_layer_interfaces SET interface_id = (CASE
        WHEN interface_id = '0' THEN 'IPv4'
        WHEN interface_id = '1' THEN 'BLE'
        WHEN interface_id = '2' THEN 'LORAWAN'
        WHEN interface_id = '3' THEN 'ZIGBEE'
        WHEN interface_id = '4' THEN 'IEEE802154'
        WHEN interface_id = '5' THEN 'IPv6'
    END);

