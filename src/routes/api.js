const logger = require('../utils/logger.util');
const express = require('express');
const router = express.Router();

const authentication = require('./api.authentication');
const wolDevices = require('./api.wolDevices');

const user = require('../controllers/user.controller');

router.use('/authentication', authentication);
router.use('/wolDevices', wolDevices);

router.get('/ping', (req, res) => {
    logger.info({ req, res, message: 'Ping Pong!' });
    res.status(200).send({ error: null, response: 'Pong' });
});

module.exports = router;
