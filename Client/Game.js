var Game = {};

Game.scoreElement = document.getElementById('score');

Game.start = function () {
    DashBoard.init(Game.data.actions);

    Game.updateScore();

    Timer.init(10);
};

Game.updateScore = function (score) {
    if (score !== undefined) {
        Game.data.score = score;
    }
    Game.scoreElement.innerHTML = Game.data.score;
};

Game.actionChanged = function (action) {
    if (Message.currentMessage.wantedValue === action.value &&
        Message.currentMessage.wantedActionId === action.id) {

        Network.actionSuccess(action.id, action.value);
    }
};