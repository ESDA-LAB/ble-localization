const express = require('express');
const router = express.Router();
const renderUtils = require('../utils/render.utils');

/**
 * Robots controller.
 */
router.get('/', function(req, res, next) {
  res.render('pages/robots/robots', renderUtils.getRenderOptions('robots'));
});

module.exports = router;
