const logger = require('./utils/logger.util');
const config = require('config').get('Node');

const app = require('express')();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const api = require('./routes/api');

const cors = require('cors');
const io = require('socket.io')(http);

require('./utils/mongo.util').connect();

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => { logger.addCorrelation(req, res, next); });
app.use((req, res, next) => {
    const after = () => {
        res.removeListener('finish', after);
        logger.audit(req, res);
    }

    res.on('finish', after);
    next();
})

app.use('/api', api);

io.on('connection', socket => {
    socket.on('getWolDevices', () => {
        socket.emit('wolDevices', null); // TODO: Fetch from mongo or similar
    });

    socket.on('wakeWolDevice', wolDeviceId => {
        // TODO: Wake WOL device
        socket.emit('wakingWolDevice', null); // TODO: Device beign awakened
    });
});

http.listen(config.port, () => {
    logger.server(`Listening on ${config.port}`);
});
