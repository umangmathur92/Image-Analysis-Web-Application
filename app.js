var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var dotenv = require('dotenv');
var cors = require('cors');
var processImage = require('express-processimage');

dotenv.config();

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
var addExperimentRouter = require('./routes/addExperiment');
var viewExperimentRouter = require('./routes/viewExperiment');
var editExperimentRouter = require('./routes/editExperiment');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(processImage('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

var corsOptions = {
    origin: 'http://localhost:3000/',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.get('http://localhost:3000/viewExperiment/editExperiment/:id', cors(corsOptions), function (req, res, next) {
    console.log('This is CORS-enabled for all origins!');
});

// allow access control
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

var sessionStore = new MySQLStore(options);

app.use(session({
    secret: 'refdfssadadsa',
    resave: false,
    store: sessionStore,
    saveUninitialized: false
    // cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', signInRouter);
app.use('/users', usersRouter);
app.use('/signUp', signUpRouter);
app.use('/home', homeRouter);
app.use('/logout', logoutRouter);
app.use('/addExperiment', addExperimentRouter);
app.use('/viewExperiment', viewExperimentRouter);
app.use('/viewExperiment/editExperiment', editExperimentRouter);

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