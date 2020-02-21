const config = require('config').get('WOL');

const WolDevice = require('../models/wol-device.model');
const ping = require('../utils/ping.util');
const wol = require('../utils/wol.util');

exports.get = async (_id) => {
    return await WolDevice.findOne({ _id }).lean().exec();
};

exports.list = async () => {
    return await WolDevice.find().lean().exec();
};

exports.post = async (wolDevice) => {
    return await new WolDevice({ 
        name: wolDevice.name,
        macAddress: wolDevice.macAddress,
        localIpAddress: wolDevice.localIpAddress,
        sshEnabled: wolDevice.sshEnabled,
        icon: wolDevice.icon
     }).save();
};

exports.wake = async (_id) => {
    let wolDevice = await this.get(_id);
    return await wol.wake(wolDevice.macAddress);
};

exports.status = async(_id) => {
    let wolDevice = await this.get(_id);
    return await ping.isAlive(wolDevice.localIpAddress);
}

exports.pollStatus = async (_id) => {
    for (let i = 0; i < config.pollTries; i++) {
        if (await this.status(_id)) {
            return true;
        }
    }

    return false;
}

sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
