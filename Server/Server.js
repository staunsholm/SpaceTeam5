var Game = require('./Game');

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

var games = {};

// handle connections
io.sockets.on('connection', function (socket) {
    socket.connectionId = connections.length;
    socket.isDirty = false;
    connections.push(socket);

    // send game info to client
    socket.on('join', function (name) {
        if (games[name] !== undefined) {
            socket.game = games[name];
        }
        else {
            socket.game = games[name] = new Game(name);
        }

        var actions = socket.game.createActions();

        socket.emit('game', {
            score: socket.game.score,
            name: socket.game.name,
            actions: actions
        });

        socket.emit('message', socket.game.createMessage(actions));
    });

    // player did something right
    socket.on('actionSuccess', function () {
        socket.game.score++;
        socket.isDirty = true;

        socket.emit('message', socket.game.createMessage(actions));
    });

    // remove client from connections list
    socket.on('disconnect', function () {
        connections.splice(socket.connectionId, 1);
        if (connections.length === 0) {
            games = {};
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
            connection.emit("score", connection.game.score);
        }
    }
}, latency);

