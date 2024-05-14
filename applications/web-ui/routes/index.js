const express = require('express');
const router = express.Router();
const devicesManager = require('../adapters/devices.manager.adapter');
const _ = require('underscore');

/**
 * Dashboard controller.
 */
router.get('/', function(req, res, next) {

  devicesManager.getLocations().then(locations =>{
    //TODO Handler error in case no locations.
    let locationId = _.first(locations).locationId;
    res.redirect('/locations/'+locationId);
  }).catch(err=> {
    //TODO Handle error.
  })
});

module.exports = router;
