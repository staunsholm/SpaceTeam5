var Events = {};

Events.game = {};

Events.init = function () {
    smokesignals.convert(Events.game);

    Events.game.on('game start', Game.start);
};