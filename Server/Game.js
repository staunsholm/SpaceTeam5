module.exports = function Game(name) {

    console.log("creating new game: " + name);

    var allActions = [
        {id: 1, label: "Flux Capacitor", type: "bool"},
        {id: 2, label: "Gamma Inducer", type: "bool"},
        {id: 3, label: "Sky Connector", type: "bool"},
        {id: 4, label: "Bunglow Shout Deterrer", type: "bool"},
        {id: 5, label: "Spike Wheel Upfuscator", type: "bool"},
        {id: 6, label: "Space Radiator", type: "bool"},
        {id: 7, label: "Lambda Uglifier", type: "bool"},
        {id: 8, label: "Liquid Sampler", type: "bool"}
    ];

    var availableActions = allActions.slice(0); // clone

    var actionPrefixes = [
        {text: 'Start the', value: 1},
        {text: 'Stop the', value: 0},
        {text: 'Turn on', value: 1},
        {text: 'Turn off', value: 0},
        {text: 'Enable', value: 1},
        {text: 'Disable', value: 0}
    ];

    this.score = 0;
    this.name = name;

    // create array containing 4 random actions, no action is available to more than one player
    this.createActions = function () {
        if (availableActions.length < 4) {
            console.log("no more actions available");
            return [];
        }

        var actions = [];
        var actionIndex;
        for (var i = 0; i < 4; i++) {
            actionIndex = Math.random() * availableActions.length | 0;
            actions.push(availableActions[actionIndex]);
            availableActions.splice(actionIndex, 1);
        }

        return actions;
    };

    // create a random message
    this.createMessage = function (actions) {
        var action = allActions[Math.random() * allActions.length | 0];
        var prefix = actionPrefixes[Math.random() * actionPrefixes.length | 0];

        var message = {
            message: prefix.text + " " + action.label,
            wantedActionId: action.id,
            wantedValue: prefix.value
        };

        return message;
    };
};
