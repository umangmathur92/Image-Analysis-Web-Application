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

        console.log("GET");
        db.query('SELECT * FROM experiment_images WHERE id='+id+' ', function (error, results, fields) {
            if (error) throw error;

                res.render('editExperiment', {uname: user.user_name, data: results});
            });

    } else {
        res.redirect('/');
    }
});

router.get('/:id', authenticationMiddleware(), function (req, res) {
    console.log("GET 1");
    res.render('editExperiment');
});

// after form submission
router.post('/:id', function (req, res, next) {
    if (req.isAuthenticated()) {
        console.log("POST");
        var user = req.user;
        console.log(user);
        console.log("exp_id: " + req.params.id);

        console.log(req.body);
        expImage = req.body.expImage;
        console.log(expImage);

        const images = (req.body.images);
        console.log(images)

        console.log("user_id: " + user.user_id);

        res.sendStatus(200);
    }
    // res.render('editExperiment');
});

// auth middleware
function authenticationMiddleware() {
    return (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect('/')
    }
}

module.exports = router;