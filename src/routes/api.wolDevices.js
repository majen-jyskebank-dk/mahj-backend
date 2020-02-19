const logger = require('../utils/logger.util');

const express = require('express');
const router = express.Router();
const { authenticate } = require('../authentication');

const wolDevice = require('../controllers/wol-device.controller');

router.use((req, res, next) => authenticate(req, res, next));

router.get('/', async (req, res) => {
    try {
        const wolDevices = await wolDevice.list();
        logger.info(req, res, `Fetched ${ wolDevices.length } WOL device(s)`);
        res.status(200).send({ error: null, response: wolDevices });
    } catch (err) {
        logger.error(req, res, 'Caught unexpected error while fetching WOL devices', err);
        res.status(500).send({ error: { code: 2000, message: 'An unexpected error occured while fethcing WOL devices' } });
    }
});

router.get('/:_id', async (req, res) => { 
    res.status(200).send(await wolDevice.get(req.params._id));
});

router.post('/', async (req, res) => {
    res.status(200).send(await wolDevice.post(req.body));
});

module.exports = router;
