const logger = require('../utils/logger.util');
const express = require('express');
const router = express.Router();

const wolDevices = require('./api.wolDevices');

const authentication = require('../authentication');
const user = require('../controllers/user.controller');

router.use('/wolDevices', wolDevices);

router.get('/ping', (req, res) => {
    logger.info(req, res, 'Ping Pong!');
    res.status(200).send('Pong');
});

router.get('/authentication/login', async (req, res) => {   
    const receivedUser = req.body;
    try {
        if (await user.isValid(receivedUser)) {
            const token = await authentication.sign({ }, { issuer: 'mahj-backend' });
            logger.info(req, res, `Signed token succesfully for user: ${ receivedUser.username }`);
            return res.status(200).send({ error: null, response: token })
        } else {
            logger.info(req, res, `Invalid login attempt for user: ${ receivedUser.username }`);
        }
    } catch (err) {
        logger.error(req, res, `Caught error while doing login for user: ${ receivedUser.username }`, err);
    }

    res.status(401).send({ error: { code: '1000', message: 'Invalid username or password' }, response: null });
});

router.get('/authentication/verify', (req, res) => {
    let token = req.headers.authorization.split(' ')[1];
    res.status(200).send(authentication.verify(token));
});

router.post('/user', async (req, res) => {
    logger.info(`Creating user with username: ${ req.body.username }`);
    res.status(200).send(await user.post(req.body));
});

module.exports = router;
