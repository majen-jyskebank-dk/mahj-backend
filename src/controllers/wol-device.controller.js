const WolDevice = require('../models/wol-device.model');

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
    const ms = Math.random() * (2000 - 250) + 250;
    console.log(`Attempting to wake device (and sleeping ${ ms } ms)`);
    await sleep(ms);
    return false;
};

exports.status = async(_id) => {
    const ms = Math.random() * (2000 - 250) + 250;
    console.log(`Attempting to get status for device (and sleeping ${ ms } ms)`);
    await sleep(ms);
    return true;
}

sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
