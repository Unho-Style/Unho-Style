var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const { Server } = require('socket.io');
const io = new Server();

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var writeRouter = require('./routes/write');
var emailconfirmRouter = require('./routes/emailconfirm');
var chatRouter = require('./routes/chat');
var ratingRouter = require('./routes/rating');
var messageRouter = require('./routes/messages');
var fileUploadApiRouter = require('./routes/api/upload');
var tradeApiRouter = require('./routes/api/trades');
var userApiRouter = require('./routes/api/user');
var chatApiRouter = require('./routes/api/chat')(io);
var productRouter = require('./routes/product');
var searchRouter = require('./routes/search');
var editInfoRouter = require('./routes/editmyinfo');
var myInfoRouter = require('./routes/info');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let sessionMiddleware = session({
    secret: 'fuck1ng! str0ng_pa55w0rd123',
    resave: false,
    saveUninitialized: true,
    cookie: {
	    httpOnly: true,
        maxAge: 86400000
    }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, 'public')));

var ios = require("express-socket.io-session");
io.use(ios(sessionMiddleware, { autoSave:true }));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/emailconfirm', emailconfirmRouter);
app.use('/api/user', userApiRouter);
app.use('/api/fileupload', fileUploadApiRouter);
app.use('/api/chat', chatApiRouter);
app.use('/api/trades', tradeApiRouter);
app.use('/product', productRouter);
app.use('/rating', ratingRouter);
app.use('/chat', chatRouter);
app.use('/search', searchRouter);
app.use('/message', messageRouter);
app.use('/write', writeRouter);
app.use('/editinfo', editInfoRouter);
app.use('/info', myInfoRouter);

app.io = io;

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

module.exports = app;
