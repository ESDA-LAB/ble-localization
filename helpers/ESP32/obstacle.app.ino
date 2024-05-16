#include <WiFi.h>
#include <PubSubClient.h>

//JSON (https://arduinojson.org/)
#include <ArduinoJson.h>

//(Library used: https://github.com/nkolban/ESP32_BLE_Arduino)
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>

#define NUMBER_OF_BEACONS 6
#define MAX_RSSI_SAMPLES 25
#define MQTT_DEFAULT_PACKET_SIZE_LENGTH 1024
#define JSON_DEFAULT_SIZE 4096

const char *beacons[NUMBER_OF_BEACONS] = { "insert the MAC_ADDRESS of your BLE devices" };
int measurements[NUMBER_OF_BEACONS][MAX_RSSI_SAMPLES];

// Wi-Fi Connection Parameters
const char* ssid     = "xxxxx"; // Enter your WiFi name
const char* password = "xxxxx";  // Enter WiFi password

// MQTT Broker (Tutotial:: https://www.emqx.com/en/blog/esp32-connects-to-the-free-public-mqtt-broker)
const char *mqtt_broker = "broker_name";
const char *topic = "topic  ";
const char *mqtt_username = "username";
const char *mqtt_password = "password";
const int mqtt_port = 1883;
const char *client_id = "esp32-client";

//BLE
const int SCAN_TIME = 2; //In seconds
BLEScan* pBLEScan;

/**
 * Adding a measurement for a specific device.
 */
void add_measurement(int beacon, int rssi, const char* beacon_addr){
  for (int i = 0; i < MAX_RSSI_SAMPLES; ++i) {
    if( measurements[beacon][i] == -200 ){
      measurements[beacon][i] = rssi;
      Serial.printf("Added[on: %d-%d]: %d %s \n",beacon, i, measurements[beacon][i], beacon_addr);
      break;
    }
  }
}

/**
 * Reset Measurements
 */
void reset_measurements(){
  for (int i = 0; i < NUMBER_OF_BEACONS; ++i) {
    for (int z = 0; z < MAX_RSSI_SAMPLES; ++z) {
        measurements[i][z] = -200;
    }
  }
}

/**
 * Add measurements for beacon in the JSON object.
 */
void add_beacon_measurements(const int index, const char* beacon_mac, JsonArray *beacon_devices){
  JsonObject beacon = (*beacon_devices).createNestedObject();
  JsonArray beacon_measurements = beacon.createNestedArray("measurements");
  beacon["deviceId"] = beacon_mac;
  for (int z = 0; z < MAX_RSSI_SAMPLES; ++z) {
    if(measurements[index][z] != -200){
      beacon_measurements.add(measurements[index][z]);
    }   
  }
}

class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks {
    void onResult(BLEAdvertisedDevice advertisedDevice) {
      for (int i = 0; i < NUMBER_OF_BEACONS; ++i) {
        if (strcmp(beacons[i], advertisedDevice.getAddress().toString().c_str()) == 0) {
          add_measurement(i, advertisedDevice.getRSSI(), advertisedDevice.getAddress().toString().c_str());
          break;
        }
      }
    }
};

int ledPin = 5;
WiFiClient espClient;
PubSubClient mqttClient(espClient);

void setup()
{
  Serial.begin(115200);
  reset_measurements();
  
  delay(500);
  Serial.print("Connecting to Wi-Fi ");
  Serial.println(ssid);
  pinMode(LED_BUILTIN, OUTPUT);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println(WiFi.status());
    delay(250);
  }

  Serial.print("WiFi connected, IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println(WiFi.macAddress());

  //connecting to a mqtt broker
  mqttClient.setServer(mqtt_broker, mqtt_port);
  mqttClient.setBufferSize(MQTT_DEFAULT_PACKET_SIZE_LENGTH);
  //   mqttClient.setCallback(callback);
  while (!mqttClient.connected()) {
    Serial.printf("The client %s connects to the public mqtt broker\n", client_id);
    if (mqttClient.connect(client_id, mqtt_username, mqtt_password)) {
      Serial.println("Public emqx mqtt broker connected");
      pinMode(LED_BUILTIN, OUTPUT);
    } else {
      Serial.print("failed with state ");
      Serial.print(mqttClient.state());
      delay(2000);
    }

  }

  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan(); //create new scan
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks(), true);
  pBLEScan->setActiveScan(true); //active scan uses more power, but get results faster
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(99);  // less or equal setInterval value

}

void loop()
{
  digitalWrite(LED_BUILTIN, HIGH);
  mqttClient.loop();
  BLEScanResults foundDevices = pBLEScan->start(SCAN_TIME, false);
  Serial.print("Devices found: ");
  Serial.println(foundDevices.getCount());
  Serial.println("Scan done!");
  pBLEScan->clearResults();   // delete results fromBLEScan buffer to release memory

  DynamicJsonDocument doc(JSON_DEFAULT_SIZE);
  JsonArray beacon_devices = doc.createNestedArray("beacons");
  add_beacon_measurements(0, "urn:esda:atlas:beacon:98072d2f6682", &beacon_devices);
  add_beacon_measurements(1, "urn:esda:atlas:beacon:98072d301500", &beacon_devices);
  add_beacon_measurements(2, "urn:esda:atlas:beacon:b0b448ed9901", &beacon_devices);
  add_beacon_measurements(3, "urn:esda:atlas:beacon:b0b448c8a206", &beacon_devices);
  add_beacon_measurements(4, "urn:esda:atlas:beacon:546c0e5345d3", &beacon_devices);
  add_beacon_measurements(5, "urn:esda:atlas:beacon:b0b448c96b02", &beacon_devices);


  char buffer[JSON_DEFAULT_SIZE];
  size_t n = serializeJson(doc, buffer);
  mqttClient.publish(topic, buffer, n);
  reset_measurements();
  delay(2000);
}
