const express = require('express');
const router = express.Router();
const renderUtils = require('../utils/render.utils');

/**
 * Devices controller.
 */
router.get('/', function(req, res, next) {

  renderUtils.getRenderOptions('devices')
      .then(options => {
        console.log(options);
        res.render('pages/edge/devices', options);
      });
});

module.exports = router;
