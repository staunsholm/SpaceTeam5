var Timer = {};

Timer.init = function (speed) {
    Timer.speed = speed;

    Timer.reset();

    var timerUI = document.getElementById('timer');

    setInterval(function () {
        var w = (Timer.time - Date.now()) / 1000 * Timer.speed;

        timerUI.style.width = (100 + w) + "%";
    }, 500);
}

Timer.reset = function () {
    Timer.time = Date.now();
};

Timer.setSpeed = function (speed) {
    Timer.speed = speed;
};