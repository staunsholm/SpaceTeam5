var games = {};

var allActions = [
    {id: 1, label: "Flux Capacitor", type: "bool", value: 0},
    {id: 2, label: "Gamma Inducer", type: "bool", value: 0},
    {id: 3, label: "Sky Connector", type: "bool", value: 0},
    {id: 4, label: "Bunglow Shout Deterrer", type: "bool", value: 0},
    {id: 5, label: "Spike Wheel Upfuscator", type: "bool", value: 0},
    {id: 6, label: "Space Radiator", type: "bool", value: 0},
    {id: 7, label: "Lambda Uglifier", type: "bool", value: 0},
    {id: 8, label: "Liquid Sampler", type: "bool", value: 0},
    {id: 9, label: "Gremlin Flasher", type: "bool", value: 0},
    {id: 10, label: "Tree Tune Minifier", type: "bool", value: 0},
    {id: 11, label: "Squash Maker 2000", type: "bool", value: 0},
    {id: 12, label: "Speed Manipulator", type: "bool", value: 0},
    {id: 13, label: "Green Light Arranger", type: "bool", value: 0},
    {id: 14, label: "Warp Drive", type: "bool", value: 0},
    {id: 15, label: "Sleep Inducer", type: "bool", value: 0},
    {id: 16, label: "Cargo Drop Off Finder", type: "bool", value: 0},
    {id: 17, label: "Ultra Blue Spotlight", type: "bool", value: 0},
    {id: 18, label: "Disco Sound Player", type: "bool", value: 0},
    {id: 19, label: "Golf Bag Destroyer", type: "bool", value: 0},
    {id: 20, label: "Sense Shifter", type: "bool", value: 0}
];

var actionOnPrefixes = [
    {text: 'Start the', value: 1},
    {text: 'Turn on', value: 1},
    {text: 'Enable', value: 1}
];
var actionOffPrefixes = [
    {text: 'Stop the', value: 0},
    {text: 'Turn off', value: 0},
    {text: 'Disable', value: 0}
];

function Game(name) {

    console.log("creating new game: " + name);

    var availableActions = allActions.slice(0); // clone
    var usedActions = [];

    // create array containing 4 random actions, no action is available to more than one player
    function getActions() {
        var actions = [];
        var actionIndex;
        for (var i = 0; i < 4 && availableActions.length > 0; i++) {
            actionIndex = Math.random() * availableActions.length | 0;
            actions.push(availableActions[actionIndex]);
            usedActions.push(availableActions[actionIndex]);
            availableActions.splice(actionIndex, 1);
        }

        return actions;
    }

    // game info
    this.info = {
        score: 0,
        name: name
    };

    // create a random message
    function createMessage() {
        var action = usedActions[Math.random() * usedActions.length | 0];

        var prefix;
        if (action.value) {
            prefix = actionOffPrefixes[Math.random() * actionOffPrefixes.length | 0];
        }
        else {
            prefix = actionOnPrefixes[Math.random() * actionOnPrefixes.length | 0];
        }

        var message = {
            message: prefix.text + " " + action.label,
            wantedActionId: action.id,
            wantedValue: prefix.value
        };

        return message;
    }

    // when all players are ready, start game by sending messages
    var numberOfPlayersReadyToPlay = 0;
    this.startGame = function () {
        numberOfPlayersReadyToPlay++;
        if (numberOfPlayersReadyToPlay >= io.sockets.clients(name).length) {
            var players = io.sockets.clients(name);
            for (var i = 0, l = players.length; i < l; i++) {
                players[i].emit('start', createMessage());
            }
        }
    };

    this.actionSuccess = function (actionId, value) {
        this.info.score++;

        // update action value
        for (var i = 0, l = usedActions.length; i < l; i++) {
            if (usedActions[i].id === actionId) {
                usedActions[i].value = value;
                break;
            }
        }

        io.sockets.in(name).emit('score', this.info.score);

        this.nextMessage();
    };

    this.nextMessage = function () {
        var players = io.sockets.clients(name);
        for (var i = 0, l = players.length; i < l; i++) {
            players[i].emit('message', createMessage());
        }
    };

    this.addPlayer = function (socket) {
        this.socket = socket;
        this.socket.actions = getActions();
    };

    this.disconnect = function () {
        // if no connections to game, then delete game
        if (io.sockets.clients(name).length <= 1) {
            console.log("no players connected to game '" + name + "'. Deleting.");
            games[name] = undefined;
        }

        // remove used actions from current game
        if (this.socket.actions && this.socket.actions.length > 0) {
            var firstAction = this.socket.actions[0];
            for (var i = 0, l = usedActions.length; i < l; i++) {
                if (usedActions[i] === firstAction) {
                    usedActions.splice(i, this.socket.actions.length);
                    break;
                }
            }
        }

        this.socket.game = null;
        this.socket = null;
    };
}

module.exports.getGame = function (name) {
    if (games[name] === undefined) {
        games[name] = new Game(name);
    }

    return games[name]
};
