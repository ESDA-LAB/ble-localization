-- ----------------------------
-- Table structure for IoT Commands
-- ----------------------------
CREATE TABLE iot_commands (
  command_id serial NOT NULL,
  created_at timestamp NULL,
  updated_at timestamp NULL,
  status varchar(25) NOT NULL,
  CONSTRAINT iot_commands_pkey PRIMARY KEY (command_id)
);

-- ----------------------------
-- Table structure for Vehicle Commands
-- ----------------------------
CREATE TABLE vehicle_commands (
  command_id int4 NOT NULL,
  vehicle_id int4 NOT NULL,
  command_type varchar(50) NOT NULL,
  parts text NOT NULL,
  CONSTRAINT vehicle_commands_pkey PRIMARY KEY (command_id),
  CONSTRAINT iot_commands_vehicleId_FK FOREIGN KEY (command_id) REFERENCES iot_commands(command_id),
  CONSTRAINT vehicle_commands_vehicleId_FK FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);
