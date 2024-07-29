if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 8888;
const session = require('express-session');
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const Message=require("./models/message..js");
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const path = require("path");
const engine = require("ejs-mate");
const http = require('http');
const socketIo = require("socket.io");

main()
  .then(() => {
    console.log("connections successfully done");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Whatsapp_clone');
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('ejs', engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const userRoute = require("./routes/user.js");
const whatsappRoute = require("./routes/whatsapp.js");

app.use(session({
  secret: process.env.SECRET_CODE,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});

app.use("/", userRoute);
app.use("/", whatsappRoute);

const server = http.createServer(app);
const io = socketIo(server);
let users = [];

let conversations = {};

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("currentUser", (user) => {
    if (!users.some((item) => item._id === user._id)) {
      users.push(user);
      conversations[user._id] = {
        socketId: socket.id
      };
    }
  });

  socket.on("newMessage", (data) => {
    let conversationId = data.conversationId;
    let senderId = data.senderId;
    let message = data.message;

    // Create a new conversation object if it doesn't exist
    if (!conversations[conversationId]) {
      conversations[conversationId] = {
        messages: [],
        users: [],
        sockets: {}
      };
    }

    // Add the message to the conversation
    conversations[conversationId].messages.push({
      text: message,
      senderId: senderId
    });

    // Add the sender to the conversation users if they're not already there
    if (!conversations[conversationId].users.includes(senderId)) {
      conversations[conversationId].users.push(senderId);
    }

    // Store the socket ID of the sender in the conversation sockets
    conversations[conversationId].sockets[senderId] = socket.id;

    findingId();
    async function findingId(){
      try { console.log(conversations)
        let response = await Message.findOne({conversationId: [conversationId]});
        console.log(response);
        let recipientId = response.recieverId;
        let recipientSocketId = conversations[conversationId].sockets[recipientId];
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("messageSent", {
            conversationId: conversationId,
            message: message,
            senderId: senderId
          });
        }
      } catch (error) {
        console.error("Error finding recipient ID:", error);
      }
    }

  });

  // Handle additional socket events here
  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});
