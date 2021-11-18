require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var flash = require('connect-flash');
var logger = require('morgan');
var mongoose = require('mongoose')
var passport = require('passport')
var indexRouter = require('./routes/user.route');
var authRouter = require('./routes/auth.route')
var accountApiRouter = require('./apis/account/account.api.route');

var app = express();
require('./config/passport')(passport)
// connect to db
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/tdtusocialmedia');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// session
app.use(session({
  secret: 'tdtusocialmedia',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))
app.use(flash());

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// static
app.use(express.static(path.join(__dirname, 'public')));

// route middleware
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/api/v1', accountApiRouter);


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
