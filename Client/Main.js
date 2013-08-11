var Main = {};

Main.start = function () {
    Events.init();

    Network.joinGame('thegame', function (data) {
        Events.game.emit('game start', data);
    });
};
