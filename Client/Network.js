var Network = {};

Network.joinGame = function (name, onSuccess) {
    onSuccess({
        actions: [
            {id: 1, label: "Flux Capacitor", type: "bool", value: 0},
            {id: 2, label: "Gamma Inducer", type: "bool", value: 0},
            {id: 3, label: "Sky Connector", type: "bool", value: 1}
        ],
        messages: [
            {wantedActionId: 1, wantedValue: 1, message: 'Start the Flux Capacitor'},
            {wantedActionId: 2, wantedValue: 1, message: 'Enable Gamma Inducer'},
            {wantedActionId: 3, wantedValue: 0, message: 'Turn off the Sky Connector'}
        ]
    });
};

Network.actionSuccess = function () {

};