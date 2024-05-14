const express = require('express');
const router = express.Router();
const _ = require('underscore');

/**
 * Applications controller.
 */
router.get('/', function(req, res, next) {
    res.json({});
    // simulationsModelerAdapter.getParametersOfType(req.query.type)
    //     .then(parameters => {
    //         // res.json(parameters);
    //     })
    //     .catch(err => {
    //         res.status(404).end();
    //     });
});

module.exports = router;
