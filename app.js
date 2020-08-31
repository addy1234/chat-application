const express = require("express");
const socket = require("socket.io");

// App setup
const PORT = 8080;
const app = express();

// Static files
app.use(express.static("public"));

const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Socket setup
const io = socket(server);

io.on("connection", function (socket) {
    console.log("Made socket connection");
    io.on('message', function(data){
      console.log(data);
    });
});
