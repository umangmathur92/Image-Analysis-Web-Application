const db = require('../database/db');
let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        let user = req.user;
        console.log(user);
        console.log("user_id: " + user.user_id);
        console.log("user_name: " + user.user_name);
        console.log("is user authenticated: " + req.isAuthenticated());

        db.query('SELECT * FROM experiments WHERE users_id = ' + user.user_id + '', function (error, results, fields) {
            if (error) throw error;

            db.query('select exp_images from experiment_images WHERE user_id = ' + user.user_id + ' LIMIT 1 ', function (err, results2, field2) {
                // db.query('select min(exp_images) as exp_images from experiment_images where user_id=30 group by exp_id', function (err, results2, field2) {
                if (error) throw error;

                res.render('home', {uname: user.user_name, data: results, eImage: results2});
            });
        });
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