const api = require('./routes/api');
const bodyParser = require('body-parser');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const wolDevices = [{ }];

app.use(bodyParser.json());
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

http.listen(4300, () => {
    console.log('Listening on port 4300');
});
