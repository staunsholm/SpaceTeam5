var Network = {};

Network.joinGame = function (name) {

    var socket = io.connect('127.0.0.1:8080');

    socket.on('connect', function () {
        socket.emit('join', name);
    });

    socket.on('game', function (data) {
        Game.data = data;

        socket.emit('ready');
    });

    socket.on('start', function (message) {
        Message.update(message);
        Game.start();
    });

    socket.on('score', function (score) {
        Game.updateScore(score);
    });

    socket.on('message', function (message) {
        Message.update(message);
    });

    Network.socket = socket;
};

Network.actionSuccess = function (actionId, value) {
    Network.socket.emit('actionSuccess', {
        actionId: actionId,
        value: value
    });
};

Network.nextMessage = function () {
    Network.socket.emit('nextMessage');
};

Network.windowOnError = window.onerror;
window.onerror = function (errorMsg, url, lineNumber) {
    if (Network.socket) {
        Network.socket.emit('window.onerror', {
            errorMsg: errorMsg,
            url: url,
            lineNumber: lineNumber
        });
    }

    if (Network.windowOnError) {
        return Network.windowOnError(errorMsg, url, lineNumber);
    }

    return false;
};
