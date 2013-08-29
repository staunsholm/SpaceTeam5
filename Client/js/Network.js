var Network = {};

Network.joinGame = function (gameName, userName) {

    var socket;
    if (location.hostname === "localhost") {
        socket = io.connect("http://" + location.hostname + ':8080');
    }
    else {
        socket = io.connect('ec2-54-229-69-55.eu-west-1.compute.amazonaws.com:8080');
    }

    socket.on('connect', function () {
        socket.emit('join', {
            gameName: gameName,
            userName: userName
        });
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

    socket.on('debug', function (data) {
        document.getElementById('debug').innerHTML = data;
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
