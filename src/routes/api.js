const express = require('express');
const router = express.Router();
const authentication = require('../authentication');
const user = require('../controllers/user.controller');
const wolDevice = require('../controllers/wol-device.controller');

router.get('/ping', (req, res) => {
    res.status(200).send('Pong');
});

router.get('/authentication/login', async (req, res) => {   
    const receivedUser = req.body;
    if (await user.isValid(receivedUser)) {
        res.status(200).send(authentication.sign({ }, { issuer: 'mahj-backend' }));
    } else {
        res.status(401).send({ error: { code: '1000', message: 'Invalid username or password' } });
    }
});

router.get('/authentication/verify', (req, res) => {
    let token = req.headers.authorization.split(' ')[1];
    res.status(200).send(authentication.verify(token));
});

router.get('/wolDevices', async (req, res) => {
    res.status(200).send(await wolDevice.list());
});

router.get('/wolDevices/:_id', async (req, res) => { 
    res.status(200).send(await wolDevice.get(req.params._id));
});

router.post('/wolDevices', async (req, res) => {
    res.status(200).send(await wolDevice.post(req.body));
});

router.post('/user', async (req, res) => {
    res.status(200).send(await user.post(req.body));
});

module.exports = router;
