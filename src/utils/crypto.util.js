const crypto = require('crypto');

exports.saltHashPassword = (password) => {
    return sha512(password, genRandomString(16));
}

genRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

sha512 = (password, salt) => {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return { salt, passwordHash: hash.digest('hex') };
};
