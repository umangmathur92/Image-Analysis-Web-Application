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

        res.render('addExperiment', {data: user.user_name});
    } else {
        res.redirect('/');
    }
});

router.get('/', authenticationMiddleware(), function (req, res) {
    res.render('addExperiment');
});

// after form submission
router.post('/', function (req, res, next) {

    expTitle = req.body.expTitle;
    expDate = req.body.expDate;
    expType = req.body.expType;

    var user = req.user;
    console.log(user);
    console.log("user_id: " + user.user_id);

    console.log("expTitle: " + expTitle);
    console.log("expDate: " + expDate);
    console.log("expType: " + expType);

        db.query('INSERT INTO experiments (users_id, exp_title, exp_date, exp_type) VALUES (?, ?, ?, ?)',
            [user.user_id, expTitle, expDate, expType], function (error, results, fields) {
                if (error) throw error;

                res.redirect('/home');
                console.log("result:" + JSON.stringify(results));
            })

});

// auth middleware
function authenticationMiddleware() {
    return (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect('/')
    }
}

module.exports = router;