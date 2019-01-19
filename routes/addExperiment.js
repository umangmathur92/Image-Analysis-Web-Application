const db = require('../database/db');
let express = require('express');
let router = express.Router();
let aws = require('aws-sdk');
let multer = require('multer');
let multerS3 = require('multer-s3');
let path = require('path');
let res = require("express");


/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        let user = req.user;
        console.log(user);
        console.log("user_id: " + user.user_id);
        console.log("user_name: " + user.user_name);
        console.log("is user authenticated: " + req.isAuthenticated());

        db.query('SELECT * FROM experiments WHERE users_id= ' + user.user_id + '', function (error, results, fields) {
            if (error) throw error;

            res.render('addExperiment', {uname: user.user_name, data: results});
        });

        // res.render('addExperiment', {uname: user.user_name});
    } else {
        res.redirect('/');
    }
});

router.get('/', authenticationMiddleware(), function (req, res) {
    res.render('addExperiment');
});

// after form submission
router.post('/', upload.array('expImage', 10), function (req, res, next) {
    let user = req.user;

    console.log("user_id: " + user.user_id);
    console.log("user_name: " + user.user_name);

    expTitle = req.body.expTitle;
    expDate = req.body.expDate;
    expType = req.body.expType;

    let body = req.body;
    console.log(body);

    let fileInfo = req.files;
    console.log(fileInfo);

    let fileLength = req.files.length;
    console.log("fileLength: " + fileLength);

    let text = "";
    for (let i = 0; i < fileLength; i++) {
        let fileName = req.files[i].location;
        console.log(text += fileName + ",");
    }

    let removedLastComma = text.substring(0, text.length - 1);
    console.log("FileNames: " + removedLastComma);

    let array = removedLastComma.split(',');
    console.log(array);

    for (let j = 0; i < array.length; i++) {
        console.log(array[i]);
    }

    let formattedString = removedLastComma.split(",").join("\n");
    console.log(formattedString);

    db.query('INSERT INTO experiments (users_id, exp_title, exp_date, exp_type) VALUES (?, ?, ?, ?)',
        [user.user_id, expTitle, expDate, expType], function (error, results, fields) {
            if (error) throw error;

            for (let k = 0; k < array.length; k++) {
                let now = new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0].replace('T', '-');
                db.query('INSERT INTO experiment_images (exp_id, user_id, exp_images, created_at) VALUES (?, ?, ?, ?)',
                    [results.insertId, user.user_id, array[k], now])
            }

            db.query('SELECT * FROM experiments WHERE users_id= ' + user.user_id + '', function (error, results, fields) {
                if (error) throw error;
                db.query('select  * from experiment_images', function (err, results2, field2) {
                    if (error) throw error;

                    res.redirect('/home');
                })
            });
        });
});

// auth middleware
function authenticationMiddleware() {
    return (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect('/')
    }
}

module.exports = router;