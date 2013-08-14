var Message = {};

Message.messageElement = document.getElementById('message');

Message.update = function (message) {
    Message.currentMessage = message;
    Message.messageElement.innerHTML = Message.currentMessage.message;

    Timer.reset();
};

