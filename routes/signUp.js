var express = require('express');
var router = express.Router();
var db = require('../helpers/db');

/* GET sign up page. */
router.get('/', function(req, res, next) {
    res.render('signUp', {title: 'sign up'});
});

// after form submission
router.post('/', function(req, res, next) {
    userName = req.body.userName;
    email = req.body.email;
    password = req.body.password;

    db.query('INSERT INTO users (userName, email, password) VALUES (?, ?, ?)',
        [userName, email, password] , function(error, results, fields) {
            if (error) throw error;
            console.log("result:" +JSON.stringify(results) );
        });

    res.render('signUp', {title:'signed up'});
});

module.exports = router;