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

        db.query('SELECT * FROM experiment_images WHERE id='+id+' ', function (error, results, fields) {
            if (error) throw error;

                res.render('editExperiment', {uname: user.user_name, data: results});
            });

    } else {
        res.redirect('/');
    }
});

router.get('/:id', authenticationMiddleware(), function (req, res) {
    res.render('editExperiment');
});

// after form submission
router.post('/:id', function (req, res, next) {
    res.render('editExperiment');
});

// auth middleware
function authenticationMiddleware() {
    return (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect('/')
    }
}

module.exports = router;