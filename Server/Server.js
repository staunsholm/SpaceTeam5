// setup
var latency = 80;
var currentLatency = 0;
var connections = [];

// setup socket.io
var express = require('express');
var app = express();
app.configure(function () {
    app.use(express.static(__dirname + '/'));
});
var server = app.listen(8080);

var socket = require('socket.io');
var io = socket.listen(server);

io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
io.set('log level', 2);                    // reduce logging
io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);

// setup game
var game = {
    actions: [
        {id: 1, label: "Flux Capacitor", type: "bool", value: 0},
        {id: 2, label: "Gamma Inducer", type: "bool", value: 0},
        {id: 3, label: "Sky Connector", type: "bool", value: 1}
    ],
    messages: [
        {wantedActionId: 1, wantedValue: 1, message: 'Start the Flux Capacitor'},
        {wantedActionId: 2, wantedValue: 1, message: 'Enable Gamma Inducer'},
        {wantedActionId: 3, wantedValue: 0, message: 'Turn off the Sky Connector'}
    ],
    score: 0
};

function resetGame() {
    game.score = 0;
}

// handle connections
io.sockets.on('connection', function (socket) {
    socket.connectionId = connections.length;
    socket.isDirty = true;
    connections.push(socket);

    // send game info to client
    socket.emit('game', game);

    // player did something right
    socket.on('actionSuccess', function () {
        game.score++;
        socket.isDirty = true;
    });

    // remove client from connections list
    socket.on('disconnect', function () {
        connections.splice(socket.connectionId, 1);
        if (connections.length === 0) {
            resetGame();
        }
    });

    // calculate current latency
    socket.on('pong', function (t) {
        currentLatency = Date.now() - t;
    });

    setInterval(function () {
        socket.emit("ping", Date.now());
    }, 5000);
});

// communicate changes to connected clients, throttled by a specified latency
setInterval(function () {
    var connection;
    for (var i = 0, l = connections.length; i < l; i++) {
        connection = connections[i];
        if (connection.isDirty) {
            connection.isDirty = false;
            connection.emit("score", connection.state.score);
        }
    }
}, latency);

