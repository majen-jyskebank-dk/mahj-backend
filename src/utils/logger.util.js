const config = require('config').get('Logging');

const uuid = require('uuid/v1');
const fs = require('fs');

exports.addCorrelation = (req, res, next) => {
    req.correlationId = uuid();
    next();
};

exports.server = (message) => {
    if (config.enableServer) log('server', `${ getTime() } [SERVER]: ${ message }`);
};

exports.serverError = (message, error) => {
    if (config.enableServer) log('server', `${ getTime() } [SERVER]: ${ message } | ${ error }`);
};

exports.audit = (req, res) => {
    if (config.enableAudit) log('audit', `${ getTime() } [AUDIT]: [${ req.method }] ${ req.url } | ${ res.statusCode } | ${ req.correlationId }`);
};

exports.info = (req, res, message) => {
    if (config.enableInfo) log('server', `${ getTime() } [INFO]: ${ message } | ${ req.correlationId }`);
};

exports.error = (req, res, message, error) => {
    if (config.enableError) log('server', `${ getTime() } [ERROR]: ${ message } | ${ error } | ${ req.correlationId }`);
};

const log = (type, message) => {
    if (!fs.existsSync('./logs')) {
        fs.mkdirSync('./logs');
    }

    try {
        fs.appendFileSync(`./logs/${ type }.log`, `${message}\n`);
        console.log(message);
    } catch(err) {
        console.error(`Caught error while attempting to log message type: ${ type }`, e);
    }
};

const getTime = () => {
    let now = new Date();
    return `${ now.getHours() }:${ now.getMinutes() }:${ now.getSeconds() },${ now.getMilliseconds() } ${ now.getDate() }-${ now.getMonth() + 1 }-${ now.getFullYear() }`
};
