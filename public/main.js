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
        var created_at = messageData.created_at.split(" ")[3];
        if(messageData.sender_id == currentUser){
            // right
            message = `<div class="sender-msg">
                            <p> ${messageData.mssg} </p>
                            <div class="check">
                                <span> ${created_at} </span>
                                <!-- <img src="img/check-2.png"> -->
                            </div>
                       </div>`
        }else{
            // left
            message = `<div class="receiver-msg">
                            <p> ${messageData.mssg} </p>
                            <div class="check">
                                <span> ${created_at} </span>
                                <!-- <img src="img/check-2.png"> -->
                            </div>
                       </div>`        }
        chatDisplay.innerHTML += message;
    }
});

function loadData(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          console.log(this.response);
    //    document.getElementById("demo").innerHTML = this.responseText;
      }
    };
    xhttp.open("GET", "http://localhost:8080/chat/" + id, true);
    xhttp.send();
}