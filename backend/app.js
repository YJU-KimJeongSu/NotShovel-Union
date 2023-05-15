const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connect = require('./models');
const app = express();
const dotenv = require('dotenv');
const SocketIO = require('socket.io');
const cors = require('cors');

dotenv.config();

const PORT = process.env.PORT;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// db 연결
connect();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(__dirname + '/public'));

require('./routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
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
    console.log(`receive context: ${chat.context}`);
    socket.to(chat.roomName).emit("new_message", chat);
    done();
  })
  
});