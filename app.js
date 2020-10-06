var express = require("express");
var socket = require("socket.io");
var mysql = require('mysql');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');


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


// Learn about SQ
// App setup
var PORT = 8080;
var app = express();

app.use(session({secret: 'ssshhhhh', saveUninitialized: true, resave: true}));

app.use((req, res, next)=>{     
  res.locals.currentUser = req.session._id;
  next();
});

// Mongoose setup

// DB setup

// Learn about cookies and sessions. 

// Use passport.js

// Add login functionality

app.set("view engine", "ejs");
// Static files
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Socket setup
var io = socket(server);

io.on("connection", function (socket) {
    console.log("Made socket connection");
    socket.on('message', function(messageData){
      console.log("##########");
      console.log(messageData);
      // socket means it will not go to sender.
      // io means it will go to sender as well.

      // Add entry into the message table.
      // Handle SQL injection
      sqlQueryMessage = "insert into message (sender_id, receiver_id, mssg) values(?, ?, ?)";
      // delete from message.
      con.query(sqlQueryMessage, 
                [messageData.sender, messageData.receiver, messageData.mssg], function(err, result) {
                sqlQueryGetRecentMessage = 'select sender_id, receiver_id, mssg, date_format(created_at, "%M %d %Y %T") as created_at from message where id = ?';
                con.query(sqlQueryGetRecentMessage, [result.insertId], function(err, result) {
                  console.log(result);
                  io.emit("messageResponse", result[0]);
                });
            });
      // io.emit("messageResponse", messageData);
    });
});

app.get('/', function(req, res){
  // console.log("*******");
  // console.log(session);
  // console.log(req.session._id);
  res.render('index.ejs', {userId: req.session._id});
});

app.get('/login', function(req, res) {
  console.log(req.session.id);
  res.render('login');
});

app.get('/chat', function(req, res) {
  // username
  // all friends.
  var getAllChatUsers = 'select id,email from users where id in (select distinct(case  when sender_id = ? then receiver_id when receiver_id = ? then sender_id end) as ids from message)';
  // console.log(getAllChatUsers);
  con.query(getAllChatUsers, [req.session._id, req.session._id], function(err, allUsers) {
    console.log(allUsers);
    res.render('chat', {userEmail: req.session.userEmail, allUsers: allUsers});
  });
});;

app.get('/chat/:id', function(req, res) {
  // Get all the chats related to the current user.
  var receiver_id = req.params.id;
  // console.log(receiver_id);
  con.query('select id,email from users where id = ?', [req.session._id], function(err, sender) {
      if(err) {
        console.log(err);
      } else{
        con.query('select id,email from users where id = ?', [receiver_id], function(err, receiver) {
          if(err){
            console.log(err);
          } else{
            // console.log(sender);
            // console.log(receiver);
            sqlQueryGetAllMessages = "select sender_id, receiver_id, mssg, date_format(created_at, '%M %d %Y %T') as created_at  from message where (sender_id = ? and receiver_id = ?) or (sender_id = ? and receiver_id = ?) order by created_at";
            con.query(sqlQueryGetAllMessages, [req.session._id, receiver_id, receiver_id, req.session._id], function(err, allMessages) {
              console.log(allMessages);
              console.log("Inside chat id function");

                var getAllChatUsers = 'select id,email from users where id in (select distinct(case  when sender_id = ? then receiver_id when receiver_id = ? then sender_id end) as ids from message)';
                // console.log(getAllChatUsers);
                con.query(getAllChatUsers, [req.session._id, req.session._id], function(err, allUsers) {
                  console.log(allUsers);
                  res.render('userChat', {allMessages: allMessages, sender: sender[0], receiver: receiver[0], allUsers: allUsers});                });
            });          
          }
        });
      }
  });
});

app.get('/users', function(req, res) {
  // Get all users id and name here.
  var curUser = req.session._id;
  sqlQueryGetAllUsers = "select id, email from users where id != ?";
  con.query(sqlQueryGetAllUsers, [curUser], function(err, users) {
    res.render('users', {users: users});
  });
});

app.get('/signup', function(req, res) {
  res.render('signup');
});

app.post('/login', function(req, res) {
  let userData =  req.body;
  // console.log(userData);
  let userEmail = userData.email;
  let userPassword = userData.password;
  
  sqlQuery = `select * from users where email='${userEmail}' and password='${userPassword}'`;
  // console.log(sqlQuery);
  con.query(sqlQuery, function(err, data) {

    if (err) {
      console.log(err); 
    } else {
        if (data.length == 0) {
          console.log('No user found');
          res.redirect('/signup');
        } else {
          // Successful logged in.
          sqlQueryGetId = `select * from users where email='${userEmail}'`;
          con.query(sqlQueryGetId, function(err, data) {
            console.log(data);
            req.session._id = data[0].id;
            req.session.userEmail = data[0].email;
            res.redirect('/chat/' + req.session._id);
          });
          // It will get executed first because of asynchronous behaviour of JS.
          console.log("In here: " + req.session._id);
        }
    }
  });
});

app.get('/logout', function(req, res) {
  if (req.session._id) {
    req.session.destroy(function(){
      res.redirect('/');
    });
  } else {
    res.redirect('/login');
  }
});

app.post('/signup', function(req, res) {
  // console.log(req.session);
  let userData =  req.body;
  // console.log(userData);
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