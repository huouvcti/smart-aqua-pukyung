const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const session = require('express-session');
// const fileStore = require('session-file-store')(session);
const {sessionStore} = require('./config/dbconn')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


const monitoringRouter = require('./routes/monitoring');
const simulatorRouter = require('./routes/simulator');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '/views'));

app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express)

app.use('/public', express.static(__dirname +'/public'));
app.use('/views', express.static(__dirname +'/views'))

app.set('views', __dirname + '/views');

app.use(express.json()); 
app.use(express.urlencoded( {extended : false } ));
app.use(cookieParser());





app.use(session({
  secret: "imth", // 암호화
  resave: false,                  // 세션을 언제나 저장
  saveUninitialized: false,        // 세션이 저장되기 전 uninitialized 상태로 미리 만들어 저장
  store: sessionStore,
  cookie: {
      maxAgeL: 1000 * 60 * 60
  }
}));




app.use(logger('dev'));



app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);




app.use('/monitoring', monitoringRouter);
app.use('/simulator', simulatorRouter);








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
