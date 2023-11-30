var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var writeRouter = require('./routes/write');
var emailconfirmRouter = require('./routes/emailconfirm');
var userApiRouter = require('./routes/api/user');
var myInfoRouter = require('./routes/myinfo');
var fileUploadApiRouter = require('./routes/api/upload');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'fuck1ng! str0ng_pa55w0rd123',
    resave: false,
    saveUninitialized: true,
    cookie: {
	    httpOnly: true,
        maxAge: 86400000
    }
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/emailconfirm', emailconfirmRouter);
app.use('/api/user', userApiRouter)
app.use('/api/fileupload', fileUploadApiRouter);
app.use('/write', writeRouter)
app.use('/myinfo', myInfoRouter)

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
