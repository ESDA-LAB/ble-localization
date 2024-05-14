const express = require('express');
const router = express.Router();
const renderUtils = require('../utils/render.utils');
const _ = require('underscore');

/**
 * Applications view controller.
 */
router.get('/', function(req, res, next) {
  res.render('pages/simulations/parameters', renderUtils.getRenderOptions('simulation-parameters'));
});

module.exports = router;
