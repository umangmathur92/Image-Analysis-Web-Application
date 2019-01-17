const db = require('../database/db');
let express = require('express');
let router = express.Router();
let multer = require('multer');
let path = require('path');
let res = require("express");
let aws = require('aws-sdk');
let multerS3 = require('multer-s3');
let s3Storage = require('multer-sharp-s3');


let upload = multer({storage: storage});

// let upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'imageanalysiswebapp',
//         acl: 'public-read',
//         metadata: function (req, file, cb) {
//             cb(null, {fieldName: 'image'});
//         },
//         key: function (req, file, cb) {
//             cb(null, Date.now().toString() + ".png")
//         }
//     })
// });

/* GET home page. */
router.get('/:id', function (req, res, next) {
    if (req.isAuthenticated()) {
        let user = req.user;
        console.log(1);
        console.log(user);
        console.log("user_id: " + user.user_id);
        console.log("user_name: " + user.user_name);
        console.log("is user authenticated: " + req.isAuthenticated());
        let id = req.params.id;
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

// delete images
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

// delete images
router.post('/:id/cropImages', function (req, res) {

    const id = req.body.data1;
    const rect = req.body.data;

    console.log("id: " + id);
    console.log("rect: " + rect);

    res.sendStatus(200);
});

// after form submission -- add images
router.post('/:id', upload.array('expImage', 10), function (req, res, next) {
    let user = req.user;
    console.log("user_id: " + user.user_id);
    console.log("user_name: " + user.user_name);
    let id = req.params.id;

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

    for (let i = 0; i < array.length; i++) {
        console.log(array[i]);
    }

    let formattedString = removedLastComma.split(",").join("\n");
    console.log(formattedString);

    db.query('SELECT * FROM experiments WHERE users_id = ' + user.user_id + ' AND exp_id=' + id + ' ', function (error, results, fields) {
        if (error) throw error;

        db.query('select * from experiment_images where exp_id=' + id + '', function (err, results2, field2) {
            if (error) throw error;

            for (let k = 0; k < array.length; k++) {
                let now = new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0].replace('T', '-');
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