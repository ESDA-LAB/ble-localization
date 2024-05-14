const express = require('express');
const router = express.Router();
const devicesAdapter = require('../../adapters/devices.manager.adapter');
const queryManagerApiAdapter = require('../../adapters/query.manager.adapter');

/**
 * Gateways controller.
 */
router.get('/', function(req, res, next) {
  devicesAdapter.getGateways(function(gateways){
      res.json(gateways);
  });
});

/**
 * Return Gateway Information
 */
router.get('/:gateway', function(req, res, next) {
    devicesAdapter.getGateway(req.params['gateway'])
        .then(gateway => {
            res.json(gateway);
        })
        .catch(err => {
            console.error(err);
            res.status(404).end();
        });
});

/**
 * Return Gateway Information
 */
router.post('/:gateway/metrics', function(req, res, next) {
    queryManagerApiAdapter.getMetrics({
        deviceType: 'gateway',
        deviceId: req.params['gateway'],
        metricType: req.body['metric']
    }).then(metrics => {
            res.json(metrics);
    }).catch(err => {
        console.error(err);
        res.status(404).json({error: err}).end();
    });
});

module.exports = router;
