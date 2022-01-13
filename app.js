require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fileUpload = require('express-fileupload');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var flash = require('connect-flash');
var logger = require('morgan');
var mongoose = require('mongoose')
var passport = require('passport')
var indexRouter = require('./routes/user.route'),
    authRouter = require('./routes/auth.route'),
    studentApiRouter = require('./apis/student/student.api.route'),
    accountApiRouter = require('./apis/account/account.api.route'),
    departmentApiRouter = require('./apis/department/department.api.route'),
    classApiRouter = require('./apis/class/class.api.route'),
    postApiRouter = require('./apis/post/post.api.route'),
    topicApiRouter = require('./apis/topic/topic.api.route'),
    commentApiRouter = require('./apis/comment/comment.api.route'),
    likeApiRouter = require('./apis/like/like.api.route'),
    notificationApiRouter = require('./apis/notification/notification.api.route');


var app = express();
require('./config/passport')(passport)
// connect to db
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/tdtusocialmedia');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(fileUpload())
// session
app.use(session({
  secret: 'tdtusocialmedia',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60*60*1000 }
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

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/api/v1', accountApiRouter);
app.use('/api/v1', studentApiRouter);
app.use('/api/v1', departmentApiRouter);
app.use('/api/v1', postApiRouter);
app.use('/api/v1', classApiRouter);
app.use('/api/v1', likeApiRouter);
app.use('/api/v1', commentApiRouter);
app.use('/api/v1', topicApiRouter);
app.use('/api/v1', notificationApiRouter);

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
