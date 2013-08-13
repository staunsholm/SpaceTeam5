var DashBoard = {};

DashBoard.init = function (actions) {
    var ui = document.getElementById('ui');

    ui.innerHTML = "";

    var btn, action;

    for (var i = 0, l = actions.length; i < l; i++) {

        action = actions[i];

        switch (action.type) {
            case "bool":
                btn = document.createElement('button');
                btn.action = actions[i];

                btn.addEventListener('click', function (e) {
                    e.target.action.value = e.target.action.value ? 0 : 1;
                    e.target.className = e.target.action.value ? "on" : "";

                    Game.actionChanged(e.target.action);
                });

                btn.innerHTML = actions[i].label;
                btn.className = action.value ? "on" : "";

                break;

            case "range":
                break;
        }


        ui.appendChild(btn);
    }
}