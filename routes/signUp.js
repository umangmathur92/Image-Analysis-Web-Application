var express = require('express');
var router = express.Router();
var db = require('../helpers/db');
var bcrypt = require('bcrypt');
const saltRounds = 10;

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

                // res.render('signUp');
                console.log("result:" + JSON.stringify(results));
            })
        res.render('signUp');
    });
});

module.exports = router;