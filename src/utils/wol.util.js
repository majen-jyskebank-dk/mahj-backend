const wol = require('node-wol');

exports.wake = async (macAddress) => {
    return new Promise((resolve, reject) => {
        wol.wake(macAddress, (err) => {
            if (!err) {
                resolve(true);
            }
        });
    });
};
