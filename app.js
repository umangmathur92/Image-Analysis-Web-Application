var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// auth packages
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);

var usersRouter = require('./routes/users');
var signUpRouter = require('./routes/signUp');
var signInRouter = require('./routes/signIn');
var homeRouter = require('./routes/home');
var logoutRouter = require('./routes/logout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var options = {
    host: 'localhost',
    user: 'root',
    password: 'rootPassword',
    database: 'NodeAuth'
};

var sessionStore = new MySQLStore(options);

app.use(session({
    secret: 'refdfssadadsa',
    resave: false,
    store: sessionStore,
    saveUninitialized: false,
    // cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', signInRouter);
app.use('/users', usersRouter);
app.use('/signUp', signUpRouter);
app.use('/home', homeRouter);
app.use('/logout', logoutRouter);

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