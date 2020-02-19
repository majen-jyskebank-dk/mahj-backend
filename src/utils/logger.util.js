const uuid = require('uuid/v1');
const fs = require('fs');

const util = require('util');

exports.addCorrelation = (req, res, next) => {
    req.correlationId = uuid();
    next();
};

exports.audit = (req, res) => {
    log('audit', `[AUDIT] ${ getTime() }: [${ req.method }] ${ req.url } | ${ res.statusCode } | ${ req.correlationId }`);
};

exports.info = (req, res, message) => {
    log('server', `[INFO] ${ getTime() }: ${ message } | ${ req.correlationId }`);
};

exports.error = (req, res, message, error) => {
    log('server', `[ERROR] ${ getTime() }: ${ message } | ${ error } | ${ req.correlationId }`);
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
    return `${ now.getFullYear() }-${ now.getMonth() + 1 }-${ now.getDate() } ${ now.getHours() }:${ now.getMinutes() }:${ now.getSeconds() },${ now.getMilliseconds() }`
};
