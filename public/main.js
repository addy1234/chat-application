const socket = io();
var messageToSend = document.getElementById('mssg');
var chatDisplay  = document.getElementById('chat-display');

function send() {
    socket.emit("message", {mssg: messageToSend.value, receiver: receiverId, sender: senderId});
    messageToSend.value = "";
}
 
socket.on("messageResponse", function(messageData){

    if (messageData.receiver_id == senderId || messageData.sender_id == senderId) {
        // console.log(currentUser);
        if(messageData.sender_id == currentUser){
            // right
            message = `<li class="right-alignment">${messageData.sender_id} to ${messageData.receiver_id}: ${messageData.mssg} : ${messageData.created_at}</li>`
        }else{
            // left
            message = `<li>${messageData.sender_id} to ${messageData.receiver_id}: ${messageData.mssg} : ${messageData.created_at}</li>`
        }
        chatDisplay.innerHTML += message;
    }
});