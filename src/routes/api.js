const logger = require('../utils/logger.util');
const express = require('express');
const router = express.Router();

const authentication = require('./api.authentication');
const wolDevices = require('./api.wolDevices');

const user = require('../controllers/user.controller');

router.use('/authentication', authentication);
router.use('/wolDevices', wolDevices);

router.get('/ping', (req, res) => {
    logger.info(req, res, 'Ping Pong!');
    res.status(200).send({ error: null, response: 'Pong' });
});

router.post('/user', async (req, res) => {
    logger.info(req, res, `Creating user with username: ${ req.body.username }`);

    try {
        const newUser = await user.post(req.body);
        logger.info(req, res, `Created new user with username: ${ newUser.username }`);
        res.status(200).send({ error: null, response: newUser });
    } catch (err) {
        logger.error(req, res, `Caught error while creating new user with username: ${ req.body.username }`, err);
        res.status(500).send({ error: { code: 3000, message: 'An unexpected error occured while creating new user' }, response: null });
    }
});

module.exports = router;
