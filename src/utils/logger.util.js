const config = require('config').get('Logging');

const uuid = require('uuid/v1');
const util = require('util');
const fs = require('fs');

exports.addCorrelation = (parameters) => {
    let id = uuid();

    if (parameters.req) {
        parameters.req.correlationId = id;
    }

    if (parameters.socket) {
        parameters.socket.correlationId = id;
    }

    parameters.next();
};

exports.server = (message) => {
    if (config.enableServer) log('server', `${ getPrefix('SERVER') } ${ message }`);
};

exports.serverError = (message, error) => {
    if (config.enableServer) log('server', `${ getPrefix('SERVER') } ${ message } | ${ error }`);
};

exports.audit = (parameters) => {
    if (config.enableAudit) {
        if (parameters.req && parameters.res) {
            log('audit', `${ getPrefix('AUDIT') } [${ parameters.req.method }] ${ parameters.req.originalUrl } | ${ parameters.res.statusCode } | ${ parameters.req.correlationId }`);
        } else if(parameters.socket && parameters.action && parameters.message) {
            log('audit', `${ getPrefix('AUDIT') } [${ parameters.action}] ${ parameters.message } | ${ parameters.socket.correlationId }`);
        } else {
            this.serverError(`Couldn't do audit log, missing parameters`, util.inspect(parameters));
        }
    }
};

exports.info = (parameters) => {
    if (config.enableInfo) {
        if (parameters.req) {
            log('server', `${ getPrefix('INFO') } ${ parameters.message } | ${ parameters.req.correlationId }`);
        } else if (parameters.socket) {
            log('server', `${ getPrefix('INFO') } ${ parameters.message } | ${ parameters.socket.correlationId }`);
        } else {
            this.serverError(`Couldn't do audit log, missing parameters`, util.inspect(parameters));
        }
    }
};

exports.error = (parameters) => {
    if (config.enableError) {
        if (parameters.req) {
            log('server', `${ getPrefix('ERROR') } ${ parameters.message } | ${ parameters.error } | ${ parameters.req.correlationId }`);
        } else if (parameters.socket) {
            log('server', `${ getPrefix('ERROR') } ${ parameters.message } | ${ parameters.error } | ${ parameters.socket.correlationId }`);
        } else {
            this.serverError(`Couldn't do audit log, missing parameters`, util.inspect(parameters));
        }
    }
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

const getPrefix = (forType) => {
    return `${ getTime() }\t${ forType }:\t`;
}

const getTime = () => {
    let now = new Date();
    return `${ now.getHours() }:${ now.getMinutes() }:${ now.getSeconds() },${ now.getMilliseconds() } ${ now.getDate() }-${ now.getMonth() + 1 }-${ now.getFullYear() }`
};
