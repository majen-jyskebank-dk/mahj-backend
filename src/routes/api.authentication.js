const logger = require('../utils/logger.util');

const express = require('express');
const router = express.Router();

const user = require('../controllers/user.controller');

const authentication = require('../authentication');

router.post('/login', async (req, res) => {   
    const receivedUser = req.body;

    if (await user.count() === 0) {
        logger.info({req, message: 'No user exists in database, assuming setup is in progress.'});
        logger.info({req, message: `Creating user with username: ${ receivedUser.username }`});
        try {
            await user.create(receivedUser);
        } catch (err) {
            logger.error({ req, message: `Failed to create user in setup mode with username: ${ receivedUser.username }`, error: err });
            return res.status(500).send({ error: { code: '1002', message: `Failed to create initial user` }, response: null });
        }
    }

    if (await user.isValid(receivedUser)) {
        try {
            const token = authentication.sign({ });
            logger.info({ req, res, message: `Signed token succesfully for user: ${ receivedUser.username }` });
            return res.status(200).send({ error: null, response: token })
        } catch (err) {
            logger.error({ req, message: `Caught error while doing login for user: ${ receivedUser.username }`, err });
        }
    } else {
        logger.info({ req, res, message: `Invalid login attempt for user: ${ receivedUser.username }` });
    }

    return res.status(400).send({ error: { code: '1001', message: 'Invalid username or password' }, response: null });
});

module.exports = router;
