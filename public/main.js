const socket = io();
var messageToSend = document.getElementById('mssg');
var chatDisplay  = document.getElementById('chat-display');

function send() {
    console.log("Inside");
    console.log(messageToSend.value);
    socket.emit("message", {mssg: messageToSend.value, receiver: receiverId, sender: senderId});
    // Add message html to chat.ejs.
    // message = `<li>${userId.innerText} to ${mssgReceiver.value}: ${messageToSend.value}</li>`
    // chatDisplay.innerHTML += message;
    messageToSend.value = "";
}

socket.on("messageResponse", function(messageData){

    if (messageData.receiver == senderId || messageData.sender == senderId) {
        message = `<li>${messageData.sender} to ${messageData.receiver}: ${messageData.mssg}</li>`
        chatDisplay.innerHTML += message;
    }
});