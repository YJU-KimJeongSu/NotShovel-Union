const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connect = require('./models');
const dotenv = require('dotenv');
const cors = require('cors');
const SocketIO = require('socket.io');
const passport = require("passport");
const session = require("express-session");

const app = express();
const passportConfig = require("./passport");
const PORT = process.env.PORT;
dotenv.config();
passportConfig();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

connect();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(__dirname + '/public'));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  credentials: true,
}));

require('./routes')(app);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

const HttpServer = app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

const io = SocketIO(HttpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 소켓 연결 시 처리 로직
io.on('connection', (socket) => {
  console.log('소켓 연결이 이루어졌습니다.');
  socket.emit("welcome");
  socket.on("enter_openChat", roomName => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });
  socket.on("new_message", (chat, done) => {
    console.log(`receive chat: ${chat.context}, ${chat.roomName}, ${chat.member_id}`);
    socket.to(chat.roomName).emit("new_message", chat);
    done();
  })
  socket.on('titleModified', (data) => {
    socket.to(data.roomName).emit('titleModified', data.title);
  });
  socket.on('dateModified', (data) => {
    socket.to(data.roomName).emit('dateModified', data.date);
  });
  socket.on('placeModified', (data) => {
    socket.to(data.roomName).emit('placeModified', data.place);
  });
  socket.on('contentModified', (data) => {
    socket.to(data.roomName).emit('contentModified', data.content);
  });
});