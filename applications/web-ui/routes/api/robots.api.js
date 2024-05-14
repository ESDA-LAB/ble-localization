const express = require('express');
const router = express.Router();
const devicesAdapter = require('../../adapters/devices.manager.adapter');

/**
 * Robots controller.
 */
router.get('/', function(req, res, next) {
  devicesAdapter.getRobots(function(robots){
      res.json(robots);
  });
});

module.exports = router;
