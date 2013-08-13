var Network = {};

Network.artificialLatency = 100;

Network.joinGame = function (name, onSuccess) {

    var socket = io.connect('127.0.0.1:8080');

    socket.on('game', function (data) {
        console.log(data);
        onSuccess(data);
    });

    socket.on('score', function (score) {
        Game.updateScore(score);

    });

    socket.on('message', function (message) {
        Message.update(message);
    });

    socket.on('ping', function (state) {
        setTimeout(function () {
            socket.emit('pong', state);
        }, Network.artificialLatency);
    });

    Network.socket = socket;
};

Network.actionSuccess = function () {
    Network.socket.emit('actionSuccess');
};