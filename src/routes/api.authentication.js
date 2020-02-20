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
            logger.info(req, res, `Signed token succesfully for user: ${ receivedUser.username }`);
            return res.status(200).send({ error: null, response: token })
        } else {
            logger.info(req, res, `Invalid login attempt for user: ${ receivedUser.username }`);
        }
    } catch (err) {
        logger.error(req, res, `Caught error while doing login for user: ${ receivedUser.username }`, err);
    }

    res.status(400).send({ error: { code: '1000', message: 'Invalid username or password' }, response: null });
});

router.get('/verify', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    res.status(200).send(authentication.verify(token));
});

module.exports = router;
