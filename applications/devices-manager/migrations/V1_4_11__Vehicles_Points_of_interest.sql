-- ----------------------------
-- Table structure for Vehicle Point of Interests
-- ----------------------------
CREATE TABLE vehicle_points_of_interests (
    vehicle_id int4 NOT NULL,
    location_id int4 NOT NULL,
    CONSTRAINT vehicle_points_of_interests_pkey PRIMARY KEY (vehicle_id, location_id),
    CONSTRAINT vehicle_points_of_interests_vehicleId_FK FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    CONSTRAINT vehicle_points_of_interests_locationId_FK FOREIGN KEY (location_id) REFERENCES locations(id)
);