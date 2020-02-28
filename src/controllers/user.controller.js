const User = require('../models/user.model');
const cryptoUtil = require('../utils/crypto.util');

exports.isValid = async (user) => {
    const foundUser = await User.findOne({ username: user.username });
    if (foundUser !== null) {
        if (foundUser.passwordHash === cryptoUtil.saltHashPassword(user.password, foundUser.salt).passwordHash) {
            return true;
        }
    }
    return false;
};

exports.count = async () => {
    return await User.countDocuments({ });
};

exports.post = async (user) => {
    const hashedPassword = cryptoUtil.saltHashPassword(user.password);
    return await new User({ 
        username: user.username,
        passwordHash: hashedPassword.passwordHash,
        salt: hashedPassword.salt
     }).save();
};
