const express = require('express');
const router = express.Router();
const authentication = require('../authentication');
const user = require('../controllers/user.controller');

router.get('/ping', (req, res) => {
    res.status(200).send('Pong');
});

router.get('/authentication/sign', (req, res) => {   
    res.status(200).send(authentication.sign({ }, { issuer: 'mahj-backend' }));
});

router.get('/authentication/verify', (req, res) => {
    let token = req.headers.authorization.split(' ')[1];
    res.status(200).send(authentication.verify(token, { issuer: 'mahj-backend' }));
});

router.get('/user', (req, res) => {
    user.get(req, res);
});

router.post('/user', (req, res) => {
    res.status(200).send(user.post(req, res));
});

module.exports = router;
