const db = require('../database/db');
var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var res = require("express");
var aws = require('aws-sdk');
var multerS3 = require('multer-s3');

var s3 = new aws.S3();

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'imageanalysiswebapp',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: 'image'});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + ".png")
        }
    })
});

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

        console.log(req.params);

        db.query('SELECT * FROM experiments WHERE users_id = ' + user.user_id + ' AND exp_id=' + id + ' ', function (error, results, fields) {
            if (error) throw error;

            db.query('SELECT * FROM experiment_images WHERE exp_id=' + id + '', function (err, results2, field2) {
                if (error) throw error;

                res.render('viewExperiment', {uname: user.user_name, data: results, eImage: results2, exp_id: id});
            });
        });

    } else {
        res.redirect('/');
    }
});

router.get('/:id', authenticationMiddleware(), function (req, res) {
    res.render('viewExperiment');
});

router.post('/:id/deleteImages', function (req, res) {

    try {
        const images = JSON.parse(req.body.images).join(',');
        db.query('DELETE FROM EXPERIMENT_IMAGES WHERE ID IN (' + images + ');', function (err, result) {
        })
    } catch (err) {
        console.log(err)
    }
    res.sendStatus(200);
});

// after form submission
router.post('/:id', upload.array('expImage', 10), function (req, res, next) {
    var user = req.user;
    console.log("user_id: " + user.user_id);
    console.log("user_name: " + user.user_name);
    var id = req.params.id;

    var fileInfo = req.files;
    console.log(fileInfo);

    var fileLength = req.files.length;
    console.log("fileLength: " + fileLength);

    var text = "";
    for (var i = 0; i < fileLength; i++) {
        var fileName = req.files[i].location;
        console.log(text += fileName + ",");
    }

    var removedLastComma = text.substring(0, text.length - 1);
    console.log("FileNames: " + removedLastComma);

    var array = removedLastComma.split(',');
    console.log(array);

    for (var j = 0; i < array.length; i++) {
        console.log(array[i]);
    }

    var formattedString = removedLastComma.split(",").join("\n");
    console.log(formattedString);

    db.query('SELECT * FROM experiments WHERE users_id = ' + user.user_id + ' AND exp_id=' + id + ' ', function (error, results, fields) {
        if (error) throw error;

        db.query('select * from experiment_images where exp_id=' + id + '', function (err, results2, field2) {
            if (error) throw error;

            for (var k = 0; k < array.length; k++) {
                var now = new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0].replace('T', '-');
                db.query('INSERT INTO experiment_images (exp_id, user_id, exp_images, created_at) VALUES (?, ?, ?, ?)',
                    [id, user.user_id, array[k], now])
            }

            res.redirect('/viewExperiment/' + id + '');
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