const db = require('../database/db');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        var user = req.user;
        console.log(user);
        console.log("user_id: " + user.user_id);
        console.log("user_name: " + user.user_name);
        console.log("is user authenticated: " + req.isAuthenticated());

        db.query('SELECT * FROM experiments WHERE users_id = '+user.user_id+'', function (error, results, fields) {
                if (error) throw error;

                res.render('home', {uname: user.user_name, data: results} );
            });

        // res.render('home', {data: user.user_name});
    } else {
        res.redirect('/');
    }
});

router.get('/', authenticationMiddleware(), function (req, res) {
    res.render('home');
});

// auth middleware
function authenticationMiddleware() {
    return (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/')
}
}

module.exports = router;