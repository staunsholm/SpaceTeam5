var Message = {};

Message.messageElement = document.getElementById('message');

Message.update = function () {
    Message.currentMessage = Game.data.messages[Game.score];
    Message.messageElement.innerHTML = Message.currentMessage.message;
};

