const express = require('express');
const router = express.Router();
const renderUtils = require('../utils/render.utils');

/**
 * Gateways controller.
 */
router.get('/', function(req, res, next) {

  renderUtils.getRenderOptions('gateways')
      .then(options => {
        console.log(options);
        res.render('pages/gateways/gateways', options);
      });
});

module.exports = router;
