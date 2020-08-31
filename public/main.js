const socket = io();
var messageToSend = document.getElementById('mssg');

function send() {
    console.log("Inside");
    console.log(messageToSend.value);
    socket.emit("message", messageToSend.value);
    return false;
}

//socket.emit("message", "Hey, this is my first message");