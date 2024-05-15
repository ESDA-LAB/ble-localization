const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require("helmet");

const indexRouter = require('./routes/index');
const profileRouter = require('./routes/profile');
const locationsRouter = require('./routes/locations');
const gatewaysRouter = require('./routes/gateways');
const devicesRouter = require('./routes/devices');
const parametersRouter = require('./routes/parameters');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(helmet()); //TOD Enable helmet. (Need some additional configurations).
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "script-src": ["'self'", "'unsafe-eval'"],
    },
  },
}));

/**
 * Routers for handling UI.
 */
app.use('/', indexRouter);
app.use('/profile', profileRouter);
app.use('/locations', locationsRouter);
app.use('/gateways', gatewaysRouter);
app.use('/devices', devicesRouter);
app.use('/parameters', parametersRouter);


/**
 * Routers for handling Rest-API.
 */
const profileRestRouter = require('./routes/api/profile.api');
const locationsRestRouter = require('./routes/api/locations.api');
const gatewaysRestRouter = require('./routes/api/gateways.api');
const devicesRestRouter = require('./routes/api/edge/devices.api');
const parametersRestRouter = require('./routes/api/parameters.api');
app.use('/rest/v1/profile', profileRestRouter);
app.use('/rest/v1/gateways', gatewaysRestRouter);
app.use('/rest/v1/devices', devicesRestRouter);
app.use('/rest/v1/locations', locationsRestRouter);
app.use('/rest/v1/parameters', parametersRestRouter);

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
  res.render('common/error');
});

module.exports = app;