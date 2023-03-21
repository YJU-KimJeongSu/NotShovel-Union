const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connect = require('./models');
const app = express();
const dotenv = require('dotenv');
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
app.use(express.static(path.join(__dirname, 'public')));

require('./routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// mongoose
//   .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Successfully connected to mongodb'))
//   .catch(e => console.error(e));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
