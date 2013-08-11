var Game = {};

Game.start = function (data) {
    Game.data = data;

    Game.score = 0;

    DashBoard.init(data.actions);

    Events.game.on('action changed', function (value) {
        if (Message.currentMessage.wantedValue === value.newValue &&
            Message.currentMessage.wantedActionId === value.action.id) {
            actionSuccess();
        }
    });

    var scoreElement = document.getElementById('score');
    scoreElement.innerHTML = Game.score;

    function actionSuccess() {
        Game.score++;

        scoreElement.innerHTML = Game.score;

        Message.update();

        Network.actionSuccess();
    }

    Message.update();

    Timer.init(1);
};
