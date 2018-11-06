var express = require('express');
var router = express.Router();
const db = require('../database/db');
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

/* GET sign in page. */
router.get('/', function (req, res, next) {
    res.render('signIn');
});

// after form submission
router.post('/',
    passport.authenticate('local', {successRedirect: '/home', failureRedirect: '/'}),
    function (req, res) {
        res.redirect('/home');
    });

passport.use(new LocalStrategy(
    function (username, password, done) {
        console.log("username is:  " +username);
        console.log(password);

        db.query('SELECT * from users WHERE username = ?', [username], function (err, results, fields) {
            if (err) {
                done(err)
            };

            // if username does not exist in db
            if (results.length === 0) {
                return done(null, false);
            }

            const hash = results[0].password;
            console.log(results[0]);

            bcrypt.compare(password, hash, function (err, response) {
                if (response === true) {
                    return done(null, {user_id: results[0].id, user_name:results[0].username });
                } else {
                    return done(null, false);
                }
            });
        })
    }
));

module.exports = router;