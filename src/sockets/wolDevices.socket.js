const logger = require('../utils/logger.util');
const wolDevice = require('../controllers/wol-device.controller');

module.exports = (io) => {
    io.on('connection', async socket => {
        socket.on('getWolDevices', () => {
            socket.emit('wolDevices', null); // TODO: Fetch from mongo or similar
        });
    
        socket.on('wakeWolDevice', async _id => {
            console.log(`Received wakeWolDevice event for ${ _id }`);
            socket.emit('attemptedWakeWolDevice', { _id, isAwake: await wolDevice.wake(_id) });
        });

        io.emit('wolDevices', await wolDevice.list());
    });
};
