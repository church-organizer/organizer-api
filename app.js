var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/*
define router here with path to file
 */
var indexRouter = require('./routes/index');
var wikiRouter = require('./routes/wiki');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('Content-Type', 'application/json');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set header
app.use(function(req, res, next) {
    res.header("Content-Type", "application/json");
    // const allowedHost = ["http://localhost:3000"];
    // if (process.env.WIKI_HOST !== undefined) {
    //     allowedHost.push(process.env.WIKI_HOST);
    // }
    // console.log(allowedHost);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "content-type");

    next();
});

/*
new routes here with url
 */
app.use('/', indexRouter);
app.use('/wiki', wikiRouter);

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
    res.render('error');
});

module.exports = app;
