const config = require('config').get('Database');
const mongoose = require('mongoose');

exports.connect = () => {
    mongoose.connect(uri(), { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
        if (err) {
            console.error('Couldn\'t connect to database', e);
        } else {
            console.log('Connected to database');
        }
    });
}

const uri = () => {
    let connectionUri = 'mongodb://';
    if (config.username.length > 0) {
        connectionUri += `${ config.username }`;
        if (config.password.length > 0) {
            connectionUri += `:${ encodeURIComponent(config.password) }@`;
        }
    }
    connectionUri += config.host;
    if (config.port.length > 0) {
        connectionUri += `:${ config.port }`;
    }
    connectionUri += `/${ config.database }`;
    return connectionUri;
}
