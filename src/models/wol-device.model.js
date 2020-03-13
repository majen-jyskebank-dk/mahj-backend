const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const WolDeviceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    macAddress: {
        type: String,
        required: true
    },
    localIpAddress: {
        type: String,
        required: true
    },
    externalIpAddress: {
        type: String,
    },
    icon: {
        type: String,
        required: true,
        default: 'device_unknown'
    }
});

module.exports = mongoose.model('WolDevice', WolDeviceSchema);
