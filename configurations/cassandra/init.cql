CREATE KEYSPACE ambient WITH REPLICATION = { 'class' : 'org.apache.cassandra.locator.SimpleStrategy', 'replication_factor': '1' } AND DURABLE_WRITES = true;

CREATE TABLE ambient.locations (
    location_id int,
    object_id frozen<tuple<int, text>>,
    created_at timestamp,
    cartesian_coordinates frozen<tuple<double, double>>,
    close_to frozen<tuple<int, text>>,
    gps_coordinates frozen<tuple<double, double, double>>,
    PRIMARY KEY (location_id, object_id, created_at)
) WITH CLUSTERING ORDER BY (object_id ASC, created_at DESC);