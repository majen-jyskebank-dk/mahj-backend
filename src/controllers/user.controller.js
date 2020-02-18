const User = require('../models/user.model');
const cryptoUtil = require('../utils/crypto.util');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mahj-backend', { useNewUrlParser: true, useUnifiedTopology: true });

exports.get = async (req, res) => {
    const foundUser = await User.findOne({ username: req.body.username });
    if (foundUser !== null) {
        if (foundUser.passwordHash === cryptoUtil.saltHashPassword(req.body.password, foundUser.salt).passwordHash) {
            return res.status(200).send({ success: true });
        }
    }
    return res.status(401).send({ success: false });
};


exports.post = (req, res) => {
    const hashedPassword = cryptoUtil.saltHashPassword(req.body.password);
    return new User({ 
        username: req.body.username,
        passwordHash: hashedPassword.passwordHash,
        salt: hashedPassword.salt
     }).save();
};
