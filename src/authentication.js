const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync('./keys/private.key', 'utf8');
const publicKey = fs.readFileSync('./keys/public.key', 'utf8');

module.exports = {
    sign: (payload, options) => {
        const signOptions = {
            issuer: options.issuer,
            expiresIn: '7d',
            algorithm: 'RS256'
        };

        return jwt.sign(payload, privateKey, signOptions);
    },
    verify: (token, options) => {
        const verifyOptions = {
            issuer: options.issuer,
            expiresIn: '7d',
            algorithm: ['RS256']
        };

        try {
            return jwt.verify(token, publicKey, verifyOptions);
        } catch (err) {
            return false;
        }
    }
};
