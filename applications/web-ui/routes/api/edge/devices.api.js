const express = require('express');
const router = express.Router();
const devicesAdapter = require('../../../adapters/devices.manager.adapter');
const queryManagerApiAdapter = require('../../../adapters/query.manager.adapter');

/**
 * Gateways controller.
 */
router.get('/', function(req, res, next) {
  devicesAdapter.getDevices()
      .then(devices => {
          res.json(devices);
      })
      .catch(err => {
        console.error(err);
        res.status(404).end();
    });
});

/**
 * Return Device Information
 */
router.get('/:device', function(req, res, next) {
    devicesAdapter.getDevice(req.params['device'])
        .then(device => {
            res.json(device);
        })
        .catch(err => {
            console.error(err);
            res.status(404).end();
        });
});

/**
 * Return Device Information
 */
router.post('/:device/metrics', function(req, res, next) {
    queryManagerApiAdapter.getMetrics({
        deviceType: 'device',
        deviceId: req.params['device'],
        metricType: req.body['metric']
    }).then(metrics => {
        res.json(metrics);
    }).catch(err => {
        console.error(err);
        res.status(404).json({error: err}).end();
    });
});

module.exports = router;
