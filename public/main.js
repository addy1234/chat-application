const socket = io();
var messageToSend = document.getElementById('mssg');
var mssgReceiver = document.getElementById('receiver');
var chatDisplay  = document.getElementById('chat-display');
var userId       = document.getElementById('currentUser');

function send() {
    console.log("Inside");
    console.log(messageToSend.value);
    socket.emit("message", {mssg: messageToSend.value, receiver: mssgReceiver.value, sender: userId.innerText});
    // Add message html to chat.ejs.
    // message = `<li>${userId.innerText} to ${mssgReceiver.value}: ${messageToSend.value}</li>`
    // chatDisplay.innerHTML += message;
    messageToSend.value = "";
    mssgReceiver.value  = "";
}

socket.on("messageResponse", function(messageData){
    console.log("Hey, I am here");
    console.log(messageData.receiver);
    console.log(userId.textContent);
    if (messageData.receiver == userId.textContent.trim() || messageData.sender == userId.textContent.trim()) {
        console.log("Inside this too");
        message = `<li>${messageData.sender} to ${messageData.receiver}: ${messageData.mssg}</li>`
        chatDisplay.innerHTML += message;
    }
});

//socket.emit("message", "Hey, this is my first message");