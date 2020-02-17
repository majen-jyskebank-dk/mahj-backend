const user = require('../models/user.model');
const cryptoUtil = require('../utils/crypto.util');

exports.get = (req, res) => {
    const data = Object.assign(req.body, { user: req.user.sub }) || { };
    
    User.find
};


exports.post = (req, res) => {
    const user = req.body;
    const hashedPassword = cryptoUtil.saltHashPassword(user.password);
};
