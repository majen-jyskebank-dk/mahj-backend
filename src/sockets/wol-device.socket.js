const logger = require('../utils/logger.util');

const authentication = require('../authentication');
const wolDevices = require('../controllers/wol-device.controller');

module.exports = async (io) => {
    const wolDevicesList = await wolDevices.list();

    io.on('connection', (socket) => {
        logger.audit({ socket, action: 'ON:connection', message: 'Established socket connection' });
        
        socket.on('authenticate', (data) => {
            socket.shouldPoll = true;

            try {
                if (authentication.verify(data.token)) {
                    socket.emit('authenticated', logger.audit({ socket, action: 'EMIT:authenticated', message: 'Authenticated socket connection' }));
    
                    wolDevicesList.forEach(wolDevice => {
                        pollStatus(socket, wolDevice._id);
                    });
    
                    socket.on('wakeWolDevice', (data) => {
                        logger.audit({ socket, action: 'ON:wakeWolDevice', message: `Wake ${ data._id }` });
                        wolDevices.wake(data._id);
                    });
                }
            } catch (err) {
                socket.disconnect();
                logger.info({ socket, message: `Couldn't authenticate socket` });
                socket.shouldPoll = false;
            }
            

            socket.on('disconnect', () => {
                socket.shouldPoll = false;
                logger.audit({ socket, action: 'ON:disconnect', message: 'Socket disconnected' });
            });
        });
    });
};


const pollStatus = async (socket, _id) => {
    let currentState, previousState;

    while (socket.shouldPoll) {
        currentState = await wolDevices.status(_id);
        if (currentState != previousState) {       
            previousState = currentState;
            socket.emit('statusUpdate', { _id, isAwake: currentState });
            logger.audit({ socket, action: 'EMIT:statusUpdate', message: `Status update to ${ currentState } for ${ _id }` });
        }
        await sleep(1000);
    }
}

sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
