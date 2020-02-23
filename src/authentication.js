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
    try {
        token = req.headers.authorization.split(' ')[1];
        if (this.verify(token)) {
            next();
        }
    } catch (err) {
        return res.status(401).send({ error: { code: 1001, message: 'Unauthorized token' } });
    }
};

exports.verify = (token) => {
    return jwt.verify(token, this.publicKey(), this.verifyOptions())
};

exports.verifyOptions = () => {
    return {
        issuer: config.issuer,
        expiresIn: config.expiresIn,
        algorithm: [ config.algorithm ]
    };
};

exports.publicKey = () => {
    return publicKey;
}
