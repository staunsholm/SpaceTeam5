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
var allActions = [
    {id: 1, label: "Flux Capacitor", type: "bool"},
    {id: 2, label: "Gamma Inducer", type: "bool"},
    {id: 3, label: "Sky Connector", type: "bool"},
    {id: 4, label: "Bunglow Shout Deterrer", type: "bool"},
    {id: 5, label: "Spike Wheel Upfuscator", type: "bool"},
    {id: 6, label: "Space Radiator", type: "bool"},
    {id: 7, label: "Lambda Uglifier", type: "bool"},
    {id: 8, label: "Liquid Sampler", type: "bool"}
];
var availableActions;

var actionPrefixes = [
    {text: 'Start the', value: 1},
    {text: 'Stop the', value: 0},
    {text: 'Turn on', value: 1},
    {text: 'Turn off', value: 0},
    {text: 'Enable', value: 1},
    {text: 'Disable', value: 0}
];

var game = {
    score: 0
};

// create array containing 4 random actions, no action is available to more than one player
function createActions() {
    if (availableActions.length < 4) {
        console.log("no more actions available");
        return [];
    }

    var actions = [];
    var actionIndex;
    for (var i = 0; i < 4; i++) {
        actionIndex = Math.random() * availableActions.length | 0;
        actions.push(availableActions[actionIndex]);
        availableActions.splice(actionIndex, 1);
    }

    return actions;
}

// create a random message
function createMessage(actions) {
    var action = allActions[Math.random() * allActions.length | 0];
    var prefix = actionPrefixes[Math.random() * actionPrefixes.length | 0];

    var message = {
        message: prefix.text + " "+ action.label,
        wantedActionId: action.id,
        wantedValue: prefix.value
    };

    return message;
}

// reset game. is called at server startup and if no player is connected
function resetGame() {
    game.score = 0;

    availableActions = allActions.slice(0); // clone array
}
resetGame();

// handle connections
io.sockets.on('connection', function (socket) {
    socket.connectionId = connections.length;
    socket.isDirty = true;
    connections.push(socket);

    // send game info to client
    var actions = createActions();
    socket.emit('game', {
        score: game.score,
        actions: actions
    });

    socket.emit('message', createMessage(actions));

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
            connection.emit("score", game.score);
        }
    }
}, latency);

