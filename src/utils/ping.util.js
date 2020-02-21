const ping = require('ping');

exports.isAlive = async (address) => {
    return (await ping.promise.probe(address)).alive;
};
