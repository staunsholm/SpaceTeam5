var Main = {};

Main.start = function () {
    Events.init();

    Network.joinGame('thegame', 'Mike-' + new Date().getTime());
};
