const express = require("express");
const socket = require("socket.io");
const mysql = require('mysql');
const passport = require('passport');
const bodyParser = require('body-parser');

var con = mysql.createConnection({
  host: "localhost",
  user: "addy1234",
  password: "1234",
  database: "chat_app"
});

// Securities provided by passport.js


con.connect(function(err) {
  if (err) throw err;
  console.log("Database Connected!");
});

// var sql_query = "insert into message (sender_id, receiver_id, mssg) values (1, 3, 'Hello')";
// con.query(sql_query, function(data){
//   console.log(data);
// })

// Add Google authentication as well.
// Learn about sessions in detail. (secret)
// Different types of sessions.


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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

app.get('/signup', function(req, res) {
  res.render('signup');
});

app.post('/login', function(req, res) {
  let userData =  req.body;
  console.log(userData);
  let userEmail = userData.email;
  let userPassword = userData.password;

  sqlQuery = `select * from users where email='${userEmail}' and password='${userPassword}}'`;
  con.query(sqlQuery, function(err, data) {
    if (err) {
      console.log(err); 
    } else {
        if (data.length == 0) {
          console.log('No user found');
          res.redirect('/signup');
        } else {
          res.redirect('/');
        }
    }
  });
});

app.post('/signup', function(req, res) {
  let userData =  req.body;
  console.log(userData);
  let userEmail = userData.email;
  let userPassword = userData.password;

  // Try using exists in sql.
  sqlQuery = `select * from users where email='${userEmail}'`;
  // sqlQuery2 = `insert into users (email, password) values ('${userEmail}', '${userPassword}')`;
  con.query(sqlQuery, function(err, data){
    if(err) {
      // Add flash message to the users to convery tumse na ho payega.
      console.log(err);
    } else {
      console.log(data);
      console.log("Query Executed Successfully");
      if (data.length == 0) {
        // Register user here.
        sqlRegisterUserQuery = `insert into users (email, password) values ('${userEmail}', '${userPassword}')`;
        con.query(sqlRegisterUserQuery, function(err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
            console.log(`User inserted in users table`);
            res.redirect('/login');
          }
        });
      } else {
        // render not working here. why?
        res.redirect('/login');
      }
    }
  })

});