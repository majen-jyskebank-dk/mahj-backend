const uuid = require('uuid/v1');
const fs = require('fs');

const util = require('util');

exports.addCorrelation = (req, res, next) => {
    req.correlationId = uuid();
    next();
};

exports.audit = (req, res, next) => {
    log('audit', `[AUDIT] ${ getTime() }: [${ req.method }] ${ req.url } | statusCode:${ res.statusCode } | ${ req.correlationId }`);
};

const log = (type, message) => {
    if (!fs.existsSync('./logs')) {
        fs.mkdirSync('./logs');
    }

    fs.appendFileSync(`./logs/${ type }.log`, `${message}\n`, (err) => {
        if (err) {
            console.error(`Caught error while attempting to log message type: ${ type }`, e);
        } else {
            console.log(message);
        }
    });
};

const getTime = () => {
    let now = new Date();
    return `${ now.getFullYear() }-${ now.getMonth() }-${ now.getDate() } ${ now.getHours() }:${ now.getMinutes() }:${ now.getSeconds() },${ now.getMilliseconds() }`
};
