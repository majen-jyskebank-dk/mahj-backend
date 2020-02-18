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
        type: String
    },
    sshEnabled: {
        type: Boolean,
        default: false
    },
    icon: {
        type: String,
        default: 'device_unknown'
    }
});

module.exports = mongoose.model('WolDevice', WolDeviceSchema);
