const logger = require('../utils/logger.util');

const authentication = require('../authentication');
const wolDevices = require('../controllers/wol-device.controller');

let shouldPoll = false; // TODO: This is a bad solution, limits clients to 1

module.exports = async (io) => {
    const wolDevicesList = await wolDevices.list();

    io.on('connection', (socket) => {
        socket.on('authenticate', (data) => {
            shouldPoll = true;

          if (authentication.verify(data.token)) {
            socket.emit('authenticated', logger.server('Authenticated client socket'));

            wolDevicesList.forEach(wolDevice => {
                pollStatus(socket, wolDevice._id);
            });

            socket.on('wakeWolDevice', (data) => {
                logger.server(`Attempting to wake ${ data._id }`);
                wolDevices.wake(data._id);
            });
          }
        });

        socket.on('disconnect', () => {
            shouldPoll = false;
        });
    });
};


const pollStatus = async (socket, _id) => {
    let currentState, previousState;

    while (shouldPoll) {
        currentState = await wolDevices.status(_id);
        if (currentState != previousState) {       
            previousState = currentState;
            socket.emit('statusUpdate', { _id, isAwake: currentState });
        }
        await sleep(1000);
    }
}

sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
