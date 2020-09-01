const socket = io();
var messageToSend = document.getElementById('mssg');
var mssgGot = document.getElementById('mssg-got');

function send() {
    console.log("Inside");
    console.log(messageToSend.value);
    socket.emit("message", messageToSend.value);
    return false;
}

socket.on("res", function(data){
    mssgGot.value = data;
});

//socket.emit("message", "Hey, this is my first message");