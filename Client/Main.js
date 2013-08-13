var Main = {};

Main.start = function () {
    Events.init();

    Network.joinGame('thegame', function (data) {
        Game.start(data);
    });
};
