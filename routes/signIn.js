var express = require('express');
var router = express.Router();
const db = require('../helpers/db');
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

/* GET sign in page. */
router.get('/', function(req, res, next) {
    res.render('signIn');
});

// after form submission
router.post('/',
    passport.authenticate('local', { successRedirect: '/home', failureRedirect: '/'}),
    function (req, res) {
        res.redirect('/home');
    });

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log(username);
        console.log(password);

        db.query('SELECT id, password from users WHERE username = ?', [username], function(err, results, fields) {
//            if (err) throw err;

            if (err) {done(err)};

            if (results.length === 0) {
                // res.redirect('/');
                return done(null, false);
            }

            const hash = results[0].password;
            console.log(results[0]);

            bcrypt.compare(password, hash, function (err, response) {
               if (response === true) {
                   return done(null, {user_id: results[0].id});
               } else {
                   // response.redirect('/');
                   return done(null, false);
                 }
            });
        })
        // return done(null, 'ssasdas');
    }
));

// passport.serializeUser(function(user_id, done) {
//     done(null, user_id);
// });
//
// passport.deserializeUser(function(user_id, done) {
//     done(null, user_id);
// });

// router.post('/', function(req, res, next) {
//     email = req.body.email;
//
//     // get password of user's email entered
//     db.query('SELECT id, password from users WHERE email = ?', [email], function(err, results, fields) {
//         if (err) throw err;
//
//         // if email does not exist within the db
//         if (results.length === null) {
//             res.redirect('/');
//         }
//
//         // get users's hashed password
//         const hash = results[0].password;
//
//         bcrypt.compare(req.body.password, hash, function(err, response) {
//             if (response === true) {
//                 console.log(results[0].id);
//                 res.render('/home', {id: results[0].id});
//             } else {
//                 res.redirect('/');
//             }
//         })
//     })
// });

// router.post('/', passport.authenticate('local', {
//     successRedirect: '/home',
//     failureRedirect: '/'
// }));

// passport.use(new LocalStrategy(
//     function(email, password, done) {
//     console.log("inside passport function");
//         // console.log(email);
//         // console.log(password);
//         return done(null, 'ssasdas');
//     }
// ));

// router.post('/', function(req, res, next) {
//
//     db.query('select * from users;', function (err, results, fields) {
//         console.log('connected');
//         if (err) throw err;
//         console.log("result:" + JSON.stringify(results));
//     });
//     res.render('signIn');
// });

module.exports = router;