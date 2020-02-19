const logger = require('./utils/logger.util');
const config = require('config').get('Authentication');

const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync('./keys/private.key', 'utf8');
const publicKey = fs.readFileSync('./keys/public.key', 'utf8');

exports.sign = (payload) => {
    const signOptions = {
        issuer: config.issuer,
        expiresIn: config.expiresIn,
        algorithm: config.algorithm
    };

    return jwt.sign(payload, privateKey, signOptions);
};

exports.authenticate = (req, res, next) => {
    const verifyOptions = {
        issuer: config.issuer,
        expiresIn: config.expiresIn,
        algorithm: [ config.algorithm ]
    };

    try {
        token = req.headers.authorization.split(' ')[1];
        if (jwt.verify(token, publicKey, verifyOptions)) {
            next();
        }
    } catch (err) {
        return res.status(401).send({ error: { code: 1001, message: 'Unauthorized token' } });
    }
};
