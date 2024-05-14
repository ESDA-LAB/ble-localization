const express = require('express');
const router = express.Router();
const devicesAdapter = require('../../adapters/devices.manager.adapter');
const queryManagerApiAdapter = require('../../adapters/query.manager.adapter');

/**
 * Locations controller.
 */
router.get('/', function(req, res, next) {
  devicesAdapter.getLocations
      .then(locations => {
        res.json(locations);
      }).catch(error => {
          console.error(error);
          res.status(422).json({ "error_code": error }).end();
      });
});

/**
 * Get information about a specific location - Rest Controller..
 */
router.get('/:location', function(req, res, next) {
    devicesAdapter.getLocation(req.params['location'])
        .then(location => {
            devicesAdapter.getAppendageInformation(location['appendageId'])
                .then(information => {
                    res.json(information);
                })
                .catch(err => {
                    console.error(err);
                    res.status(404).end();
                });
        })
        .catch(err => {
            console.error(err);
            res.status(404).end();
        });
});


/**
 * Locations Maps controller.
 */
router.get('/:location/map', function(req, res, next) {
    devicesAdapter.getLocationMap(req.params.location)
        .then(map => {
            res.json(map);
        }).catch(error => {
            console.error(error);
            res.status(422).json({ "error_code": error.code }).end();
        });
});

/**
 * Controller for obtaining object positions for specific location.
 */
router.get('/:location/objects', function(req, res, next) {
    queryManagerApiAdapter.getObjectPositions(req.params.location)
        .then(locations => {
            res.json(locations);
        })
        .catch(ambientError => {
            console.error(ambientError);
            res.status(404).end();
        });
});

/**
 * Controller for obtaining ambient measurements.
 */
router.get('/:location/ambient', function(req, res, next) {
    queryManagerApiAdapter.getAmbient(req.params.location)
        .then(ambient => {
            res.json(ambient);
        })
        .catch(ambientError => {
            console.error(ambientError);
            res.status(404).end();
        });
});

module.exports = router;
