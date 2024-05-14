const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const config  = require('config');
const multer = require('multer');
const temporaryFolder = config.get('common.temporary.folder');
const upload = multer({ dest: temporaryFolder });
const toolsAdapter = require('../../adapters/tools.adapter');

console.log("Checking if temporary folder existing and generating if not..")
if (!fs.existsSync(temporaryFolder)) {
    console.log("Temp folder ["+temporaryFolder+"] not exist, creating it...");
    fs.mkdirSync(temporaryFolder);
}

// Upload function JSON file
router.post('/bsplacement', upload.single('geojson'), (req, res) => {
    const uploadedFile = req.file;
    const baseStations = JSON.parse(req.body.basestations);
    const iterations = parseInt(req.body.iterations);
    const session = req.body['session'];
    const filename = path.join(temporaryFolder, uploadedFile.originalname);
    fs.rename(uploadedFile.path, filename, (err) => {
        if (err) return res.status(500).json({ error: 'Error, ' + err.toString() });

        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) return res.status(500).json({ error: 'Unable to read JSON file, ' + err.toString() });
            const area = JSON.parse(data);
            toolsAdapter.applyBaseStationsToArea(area, baseStations, { iterations: iterations, session: session })
                .then(placementInfo => {
                    fs.unlink(filename, (err) => {
                        if (err) {
                            console.error("Unable to delete temp file: " + filename);
                            res.status(422).json({ error: err })
                            return
                        }
                        res.json(placementInfo);
                    });
                })
                .catch(err => {
                    console.error(err);
                    res.status(422).json({error: err});
                });
        });
    });
});

/**
 *  Get the locations as gps or cartesian.
 */
router.get('/bsplacement/locations/:type', function(req, res){
    if( (req.params.type !== 'gps' && req.params.type !== 'cartesian') && (req.query.from !== 'gps' && req.query.from !== 'cartesian') ){
        res.status(422).json({error: 'Allowed values are gps,cartesian'});
        return;
    }
    if( req.params.type === req.query.from ){
        res.status(422).json({error: 'From & Type cannot be same.'});
        return;
    }
    toolsAdapter.getPlacement(req.query.sessionId, req.query.from,  req.params.type)
        .then(csvInfo => {  res.json(csvInfo) })
        .catch(err => {
            console.error(err);
            res.status(422).json({error: err});
        });
})

module.exports = router;
