var EventEmitter = require('EventEmitter');

var latency = 80;

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

var playerState = {
    position: 0,
    jump: 0,
    startMovingForward: 0,
    startMovingBackward: 0
};

var currentLatency = 0;
var speed = 0.1;
var connections = [];

io.sockets.on('connection', function (socket) {
    socket.connectionId = connections.length;
    socket.isDirty = true;
    socket.state = {
        position: 0,
        startJump: 0,
        startMovingForward: 0,
        startMovingBackward: 0
    }
    connections.push(socket);

    socket.on('disconnect', function () {
        connections.splice(socket.connectionId, 1);
    });

    socket.on('jump', function () {
        socket.state.startJump = Date.now();
        socket.isDirty = true;
    });

    socket.on('moveForward', function () {
        socket.state.startMovingForward = Date.now();
        socket.isDirty = true;
    });

    socket.on('moveBackward', function () {
        socket.state.startMovingBackward = Date.now();
        socket.isDirty = true;
    });

    socket.on('stop', function () {
        updatePosition(socket.state);
        socket.state.startMovingForward = 0;
        socket.state.startMovingBackward = 0;

        socket.isDirty = true;
    });

    socket.on('pong', function (t) {
        currentLatency = Date.now() - t;
    });

    setInterval(function () {
        socket.emit("ping", Date.now());
    }, 5000);
});

function updatePosition(state) {
    if (state.startMovingForward) {
        state.position += (Date.now() - state.startMovingForward) * speed;
    }
    if (state.startMovingBackward) {
        state.position -= (Date.now() - state.startMovingBackward) * speed;
    }
}

setInterval(function () {
    var connection;
    for (var i = 0, l = connections.length; i < l; i++) {
        connection = connections[i];
        if (connection.isDirty) {
            connection.isDirty = false;
            updatePosition(connection.state);
            connection.emit("state", connection.state);
        }
    }
}, latency);

