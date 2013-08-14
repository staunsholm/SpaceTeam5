var Game = require('./Game');

// setup socket.io
var express = require('express');
var app = express();
app.configure(function () {
    app.use(express.static(__dirname + '/'));
});
var server = app.listen(8080);

io = require('socket.io').listen(server);

io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
io.set('log level', 2);                    // reduce logging
io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);

var clientErrors = [];

// handle connections
io.sockets.on('connection', function (socket) {
    // send game info to client
    socket.on('join', function (name) {
        socket.game = Game.getGame(name);

        socket.game.addPlayer(socket);

        socket.join(name);

        socket.emit('game', {
            score: socket.game.info.score,
            actions: socket.actions
        });
    });

    // client signals he is ready to play
    socket.on('ready', function () {
        // start game when all players are ready
        socket.game.startGame();
    });

    // player did something right
    socket.on('actionSuccess', function(data) {
        socket.game.actionSuccess(data.actionId, data.value);
    });

    // send new message to player
    socket.on('nextMessage', function() {
        socket.game.nextMessage();
    });

    // client threw js exception
    socket.on('window.onerror', function (e) {
        clientErrors.push(e);
    });

    // remove client from connections list
    socket.on('disconnect', function () {
    });
});
