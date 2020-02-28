const logger = require('../utils/logger.util');

const express = require('express');
const router = express.Router();

const user = require('../controllers/user.controller');

const authentication = require('../authentication');

router.post('/login', async (req, res) => {   
    const receivedUser = req.body;

    try {
        if (await user.isValid(receivedUser)) {
            const token = authentication.sign({ });
            logger.info({ req, res, message: `Signed token succesfully for user: ${ receivedUser.username }` });
            return res.status(200).send({ error: null, response: token })
        } else {
            logger.info({ req, res, message: `Invalid login attempt for user: ${ receivedUser.username }` });
        }
    } catch (err) {
        logger.error({ req, res, message: `Caught error while doing login for user: ${ receivedUser.username }`, err });
    }

    res.status(400).send({ error: { code: '1001', message: 'Invalid username or password' }, response: null });
});

module.exports = router;
