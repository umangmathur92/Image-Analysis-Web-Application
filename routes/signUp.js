var express = require('express');
var router = express.Router();
var db = require('../helpers/db');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var passport = require('passport');

/* GET sign up page. */
router.get('/', function(req, res, next) {
    res.render('signUp');
});

// after form submission
router.post('/', function(req, res, next) {

    userName = req.body.userName;
    email = req.body.email;
    password = req.body.password;

    bcrypt.hash(password, saltRounds, function (err, hash) {
        db.query('INSERT INTO users (userName, email, password) VALUES (?, ?, ?)',
            [userName, email, hash], function (error, results, fields) {
                if (error) throw error;

                db.query('SELECT LAST_INSERT_ID() AS user_id', function (error, results, fields) {
                    if (error) throw error;

                    // get userId of logged in user
                    const user_id = results[0];

                    console.log(user_id);
                    req.logIn(user_id, function(err) {
                        // if success
                        res.redirect('/home');

                    });
                    // res.render('home');
                });
                // res.render('signUp');
                console.log("result:" + JSON.stringify(results));
            })
        // res.render('signUp');
    });
});

passport.serializeUser(function(user_id, done) {
    done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
        done(null, user_id);
});

module.exports = router;