var Timer = {};

Timer.init = function (speed) {
    Timer.speed = speed;

    Timer.reset();

    var timerUI = document.getElementById('timer');

    function tick() {
        var w = (Timer.time - Date.now()) / 1000 * Timer.speed;

        if (w <= -100) {
            Events.timeout.emit();
            w = -100;

            Network.nextMessage();
        }

        timerUI.style.width = (100 + w) + "%";

        setTimeout(tick, 500);
    }
    tick();
};

Timer.reset = function () {
    Timer.time = Date.now();
};

Timer.setSpeed = function (speed) {
    Timer.speed = speed;
};