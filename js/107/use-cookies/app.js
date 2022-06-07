var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(cookieParser('secret'));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  //const cookieColors = req.cookies['colors'] ? JSON.parse(req.cookies['colors']) : {};
  const cookieColors = req.signedCookies['colors'] ? JSON.parse(req.signedCookies['colors']) : {};

  const colors = {
    color: req.query.color || cookieColors.color || '#000000',
    bgcolor: req.query.bgcolor || cookieColors.bgcolor || '#ffffff'
  };

  res.cookie('colors', JSON.stringify(colors), { maxAge: 200000, httpOnly: true, signed: true, secure: true });

  res.locals.color = colors.color;
  res.locals.bgcolor = colors.bgcolor;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('layout', { partials: { content: 'error' } });
});

app.locals.appTitle = 'PCS Cookie app';
module.exports = app;
