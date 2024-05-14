const express = require('express');
const router = express.Router();
const renderUtils = require('../utils/render.utils');

/**
 * Locations view controller.
 */
router.get('/', function(req, res, next) {
  renderUtils.getRenderOptions('locations')
      .then(options => {
        console.log(options);
        res.render('pages/locations/locations', options);
      });
});

/**
 * Specific location view controller.
 */
router.get('/:locationId', function(req, res, next) {
    renderUtils.getRenderOptions('my-location', { locationId: req.params.locationId })
        .then(options => {
            res.render('pages/profile/mylocation', options);
        });
});

module.exports = router;
