/**
 * app.ts
 */

import { articlesRouter } from './routes/articles'
const baseloginRouter = require('./routes/baselogin');
import { baseredirectRouter } from './routes/baseredirect'
const test1Router = require('./routes/test1');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

// Initiate environment variables.
const env = require('dotenv')
env.config()

// Initiate datbase connection.
import { initPostgres } from './modules/db'
initPostgres()

var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/articles', articlesRouter);
app.use('/baselogin', baseloginRouter);
app.use('/baseredirect', baseredirectRouter);
app.use('/users', usersRouter);
app.use('/test1', test1Router);

// catch 404 and forward to error handler
app.use(function(req: any, res: any, next: any) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
