const jwt = require('jsonwebtoken');
const fs = require('fs');
const config = require('config').get('Authentication');

const privateKey = fs.readFileSync('./keys/private.key', 'utf8');
const publicKey = fs.readFileSync('./keys/public.key', 'utf8');

module.exports = {
    sign: (payload, options) => {
        const signOptions = {
            issuer: config.issuer,
            expiresIn: config.expiresIn,
            algorithm: config.algorithm
        };

        return jwt.sign(payload, privateKey, signOptions);
    },
    verify: (token) => {
        const verifyOptions = {
            issuer: config.issuer,
            expiresIn: config.expiresIn,
            algorithm: [config.algorithm]
        };

        try {
            return jwt.verify(token, publicKey, verifyOptions);
        } catch (err) {
            return false;
        }
    }
};
