-- ----------------------------
-- Table structure for device datatypes
-- ----------------------------
CREATE TABLE vehicle_compartments (
    vehicle_id int4 NOT NULL,
    compartment_idx int2 NOT NULL,
    device_id int4 NOT NULL,
    CONSTRAINT vehicle_compartments_pkey PRIMARY KEY (vehicle_id, compartment_idx, device_id),
    CONSTRAINT VehicleCompartments_vehicleId_FK FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    CONSTRAINT VehicleCompartments_deviceId_FK FOREIGN KEY (device_id) REFERENCES devices(id)
);
