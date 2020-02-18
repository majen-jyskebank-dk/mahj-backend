const api = require('./routes/api');
const bodyParser = require('body-parser');
const config = require('config').get('Node');
const { audit, addCorrelation } = require('./utils/logger.util');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

require('./utils/mongo.util').connect();

const wolDevices = [{ }];

app.use(bodyParser.json());
app.use((req, res, next) => { addCorrelation(req, res, next); });
app.use((req, res, next) => { audit(req, res, next); });
app.use('/api', api);

io.on('connection', socket => {
    socket.on('getWolDevices', () => {
        socket.emit('wolDevices', wolDevices); // TODO: Fetch from mongo or similar
    });

    socket.on('wakeWolDevice', wolDeviceId => {
        // TODO: Wake WOL device
        socket.emit('wakingWolDevice', wolDevices[0]); // TODO: Device beign awakened
    });
});

http.listen(config.port, () => {
    console.log(`Listening on ${config.port}`);
});
