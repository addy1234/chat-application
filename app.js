const express = require("express");
const socket = require("socket.io");
const mysql = require('mysql');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');


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

app.use(session({secret: 'ssshhhhh'}));
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
  console.log("*******");
  console.log(req.sessionID);
  res.render('index.ejs');
});

app.get('/login', function(req, res) {
  console.log(req.sessionID);
  //console.log(req);
  //console.log("*********");
  //console.log(res);
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

  sqlQuery = `select * from users where email='${userEmail}' and password='${userPassword}'`;
  console.log(sqlQuery);
  con.query(sqlQuery, function(err, data) {
    if (err) {
      console.log(err); 
    } else {
        if (data.length == 0) {
          console.log('No user found');
          res.redirect('/signup');
        } else {
          // Successful logged in.
          sqlQueryGetId = `select id from users where email='${userEmail}'`;
          con.query(sqlQueryGetId, function(err, data) {
            console.log(data);
            console.log(data[0].id);
            req.session._id = data[0].id;
            console.log(req.session._id);
          });
          res.redirect('/');
        }
    }
  });
});

app.post('/signup', function(req, res) {
  console.log(req.session);
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