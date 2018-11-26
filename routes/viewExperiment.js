const db = require('../database/db');
var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var res = require("express");

/* GET home page. */
router.get('/:id', function (req, res, next) {
    if (req.isAuthenticated()) {
        var user = req.user;
        console.log(user);
        console.log("user_id: " + user.user_id);
        console.log("user_name: " + user.user_name);
        console.log("is user authenticated: " + req.isAuthenticated());
        var id = req.params.id;
        console.log(id);

        db.query('SELECT * FROM experiments WHERE users_id = '+user.user_id+' AND exp_id='+id+' ', function (error, results, fields) {
            if (error) throw error;

            db.query('select * from experiment_images where exp_id='+id+'', function (err, results2, field2) {
                if (error) throw error;

                var text = "";

                for (var i = 0; i < 2; i++) {
                    var fileName = results2[i].exp_images;

                    console.log(text+=fileName + "," );
                }

                res.render('viewExperiment', {uname: user.user_name, data: results, eImage: text});
            });
        });

        // res.render('viewExperiment', {uname: user.user_name});
    } else {
        res.redirect('/');
    }
});

router.get('/:id', authenticationMiddleware(), function (req, res) {
    res.render('viewExperiment');
});

// after form submission
router.post('/:id', function (req, res, next) {
    res.render('viewExperiment');
});

// auth middleware
function authenticationMiddleware() {
    return (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect('/')
    }
}

module.exports = router;