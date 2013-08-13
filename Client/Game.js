var Game = {};

Game.scoreElement = document.getElementById('score');

Game.start = function (data) {
    Game.data = data;

    DashBoard.init(data.actions);

    Game.updateScore();

    Timer.init(1);
};

Game.updateScore = function (score) {
    if (score !== undefined) {
        Game.data.score = score;
    }
    Game.scoreElement.innerHTML = Game.data.score;
};

Game.actionChanged = function (action) {
    if (Message.currentMessage.wantedValue === action.newValue &&
        Message.currentMessage.wantedActionId === action.id) {

        Game.updateScore();

        Message.update();

        Network.actionSuccess();
    }
};