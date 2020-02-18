const WolDevice = require('../models/wol-device.model');

exports.get = async (_id) => {
    return await WolDevice.findOne({ _id });
};

exports.list = async () => {
    return await WolDevice.find();
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
