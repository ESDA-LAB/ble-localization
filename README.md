# BLE Localization  

#
![https://esdalab.ece.uop.gr/index.php/en/](images/esda_log.png)

## Overview



## How to run 



`docker network create smart4all-net`


## Payload
MQTT Topic: `indoor/urn:esda:atlas:device:B00000000002/presence`
`{
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
}`