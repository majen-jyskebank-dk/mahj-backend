const logger = require('../utils/logger.util');

const authentication = require('../authentication');
const wolDevices = require('../controllers/wol-device.controller');

module.exports = async (io) => {
    io.on('connection', (socket) => {
        logger.audit({ socket, action: 'ON:connection', message: 'Established socket connection' });
        
        socket.on('disconnect', () => {
            socket.shouldPoll = false;
            logger.audit({ socket, action: 'ON:disconnect', message: 'Socket disconnected' });
        });
        
        socket.on('authenticate', async (data) => {
            logger.audit({ socket, action: 'ON:authenticate', message: 'Attempting to authenticate socket' });

            try {
                if (!authentication.verify(data.token)) {
                    throw new Error('Invalid token');
                }
            } catch (err) {
                logger.info({ socket, message: `Couldn't authenticate socket` });
                socket.disconnect();
                return;
            }

            socket.emit('authenticated', logger.audit({ socket, action: 'EMIT:authenticated', message: 'Authenticated socket connection' }));
            socket.shouldPoll = true;
            (await wolDevices.list()).forEach(wolDevice => {
                pollStatus(socket, wolDevice._id);
            });

            socket.on('createWolDevice', async (data) => {
                logger.audit({ socket, action: 'ON:createWolDevice', message: 'Create WOL device' });
                let wolDevice = await wolDevices.create(data);
                socket.emit('createdWolDevice', { _id: wolDevice._id });
                logger.audit({ socket, action: 'EMIT:createdWolDeice', message: `Created WOL device ${ wolDevice._id }` });
                pollStatus(socket, wolDevice._id);
            });

            socket.on('updateWolDevice', async (data) => {
                logger.audit({ socket, action: 'ON:updateWolDevice', message: `Update WOL device ${ data._id }`});
                socket.emit('updatedWolDevice', { wolDevice: await wolDevices.update(data) });
            });

            socket.on('deleteWolDevice', async (data) => {
                logger.audit({ socket, action: 'ON:deleteWolDevice', message: `Delete WOL device ${ data._id }` });
                await wolDevices.delete(data._id);
                socket.emit('deletedWolDevice', { _id: data._id });
                logger.audit({socket, action: 'EMIT:deletedWolDevice', message: `Deleted WOL device ${ data._id }`});
            });

            socket.on('wakeWolDevice', (data) => {
                logger.audit({ socket, action: 'ON:wakeWolDevice', message: `Wake ${ data._id }` });
                wolDevices.wake(data._id);
            });
        });
    });
};


const pollStatus = async (socket, _id) => {
    let currentState, previousState;

    while (socket.shouldPoll) {
        try {
            currentState = await wolDevices.status(_id);

            if (currentState != previousState) {       
                previousState = currentState;
                socket.emit('statusUpdate', { _id, isAwake: currentState });
                logger.audit({ socket, action: 'EMIT:statusUpdate', message: `Status update to ${ currentState } for ${ _id }` });
            }
            await sleep(1000);
        } catch (err) {
            logger.serverError(`Caught error while polling status for ${ _id }`, err);
            return;
        }
    }
}

sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
