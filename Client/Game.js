var Game = {};

Game.scoreElement = document.getElementById('score');

Game.start = function (data) {
    Game.data = data;

    DashBoard.init(data.actions);

    Events.game.on('action changed', function (value) {
        if (Message.currentMessage.wantedValue === value.newValue &&
            Message.currentMessage.wantedActionId === value.action.id) {
            actionSuccess();
        }
    });

    Game.updateScore();

    function actionSuccess() {
        Game.updateScore();

        Message.update();

        Network.actionSuccess();
    }

    Timer.init(1);
};

Game.updateScore = function (score) {
    if (score !== undefined) {
        Game.data.score = score;
    }
    Game.scoreElement.innerHTML = Game.data.score;
};