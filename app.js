const express = require("express");
const socket = require("socket.io");
const mysql = require('mysql');
const passport = require('passport');
const configPassport = require('./config/configPassport');

configPassport(passport);
app.use(require('express-session')
({    
      secret: "this is first site I'm gonna Deploy",
      resave: false,
      saveUninitialized: false 
}));  

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.post('/signup', passport.authenticate('local-signup'), function(req, res){
  
});

app.post('/login', passport.authenticate('local-login'), userResponse);

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "addy1234",
//   password: "1234",
//   database: "chat_app"
// });

// Securities provided by passport.js


// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

// var sql_query = "insert into message (sender_id, receiver_id, mssg) values (1, 3, 'Hello')";
// con.query(sql_query, function(data){
//   console.log(data);
// })

// Add Google authentication as well.


// App setup
const PORT = 8080;
const app = express();

// Mongoose setup

// DB setup


// Use passport.js

// Add login functionality

app.set("view engine", "ejs");
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
    socket.on('message', function(data){
      console.log(data);
      socket.broadcast.emit("res", data);
    });
});

app.get('/', function(req, res){
  res.render('index.ejs');
});

app.get('/login', function(req, res) {
  res.render('login');
});


