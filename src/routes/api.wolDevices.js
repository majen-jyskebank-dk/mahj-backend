const express = require('express');
const router = express.Router();
const { authenticate } = require('../authentication');

const wolDevice = require('../controllers/wol-device.controller');

router.use((req, res, next) => authenticate(req, res, next));

router.get('/wolDevices', async (req, res) => {
    res.status(200).send(await wolDevice.list());
});

router.get('/wolDevices/:_id', async (req, res) => { 
    res.status(200).send(await wolDevice.get(req.params._id));
});

router.post('/wolDevices', async (req, res) => {
    res.status(200).send(await wolDevice.post(req.body));
});

module.exports = router;
