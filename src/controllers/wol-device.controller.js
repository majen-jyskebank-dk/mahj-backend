const WolDevice = require('../models/wol-device.model');
const ping = require('../utils/ping.util');
const wol = require('../utils/wol.util');

exports.getLean = async (_id) => {
    return await WolDevice.findOne({ _id }).lean().exec();
};

exports.get = async (_id) => {
    return await WolDevice.findById(_id).lean().exec();
}

exports.list = async () => {
    return await WolDevice.find().lean().exec();
};

exports.create = async (wolDevice) => {
    return (await new WolDevice({ 
        name: wolDevice.name,
        macAddress: wolDevice.macAddress,
        localIpAddress: wolDevice.localIpAddress,
        externalIpAddress: wolDevice.externalIpAddress,
        icon: wolDevice.icon
     }).save()).toObject();
};

exports.update = async (data) => {
    return await WolDevice.findByIdAndUpdate(
        data._id,
        {
            name: data.name,
            macAddress: data.macAddress,
            localIpAddress: data.localIpAddress,
            externalIpAddress: data.externalIpAddress,
            icon: data.icon
        },
        { useFindAndModify: false }).lean().exec();
};

exports.delete = async (_id) => {
    return await WolDevice.findByIdAndDelete(_id, { useFindAndModify: false }).lean().exec();
};

exports.wake = async (_id) => {
    let wolDevice = await this.getLean(_id);
    return await wol.wake(wolDevice.macAddress);
};

exports.status = async(_id) => {
    let wolDevice = await this.getLean(_id);

    if (!wolDevice) throw new Error(`No WOL device found with ID: ${ _id }`);

    return await ping.isAlive(wolDevice.localIpAddress);
};
