var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

var app = express();

app.use(session({
  secret: 'Joes Pizza',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    //cookie lasts for 10 minutes
    maxAge: 60000 * 10 
  }
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/api/v2', authRouter);

//serve the angular app
app.use(express.static(path.join(__dirname, '../client/dist/client')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/client/index.html')); 
});

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
  res.send('error');
});

module.exports = app;
