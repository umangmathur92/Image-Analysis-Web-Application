const db = require('../database/db');
var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var res = require("express");

// set storage engine
var storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        // cb(error, fileName after upload -- fieldname is image so it will be image - timestamp.ext)
        // path module uses extname function and extract files extension
        var now = new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0].replace('T','-');
        cb(null, req.body.expTitle + '-' + now +
            path.extname(file.originalname));
    }
});

// initialize upload variable
var upload = multer({
    storage: storage,
    limits: {fileSize: 1000000}, // 1MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).array('expImage', 10);
// }).single("expImage");

// check extension and mime type of the file
function checkFileType(file, cb) {
    // allowed extensions
    var filetypes = /jpeg|jpg|png|gif/;
    // check extensions - use js test function
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // check mime type
    var mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        var user = req.user;
        console.log(user);
        console.log("user_id: " + user.user_id);
        console.log("user_name: " + user.user_name);
        console.log("is user authenticated: " + req.isAuthenticated());

        db.query('select * from experiments where users_id= '+ user.user_id +'', function (error, results, fields) {
            if (error) throw error;

            res.render('addExperiment', {uname: user.user_name, data: results} );
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
router.post('/', function (req, res, next) {
    upload(req, res, function (err) {
        var user = req.user;

        console.log("user_id: " + user.user_id);
        console.log("user_name: " + user.user_name);

        expTitle = req.body.expTitle;
        expDate = req.body.expDate;
        expType = req.body.expType;
        // expImage = req.body.expImage;

        var body = req.body;
        console.log(body);

        var fileInfo = req.files;
        console.log(fileInfo);

        // var filename = req.file.originalname;

        var fileLength = req.files.length;
        console.log("fileLength: " + fileLength);

        var text="";
        for (var i = 0; i < fileLength; i++) {
            var fileName = req.files[i].originalname;

            console.log(text += fileName + "," );
        }

        var removedLastComma = text.substring(0, text.length-1);
        console.log("FileNames: " + removedLastComma);

        var array = removedLastComma.split(',');
        console.log(array);

        for (var j = 0; i < array.length; i++) {
            console.log(array[i]);
        }

        var formattedString = removedLastComma.split(",").join("\n");
        console.log(formattedString);

        console.log("expTitle: " + expTitle);
        console.log("expDate: " + expDate);
        console.log("expType: " + expType);

        db.query('INSERT INTO experiments (users_id, exp_title, exp_date, exp_type) VALUES (?, ?, ?, ?)',
            [user.user_id, expTitle, expDate, expType], function (error, results, fields) {
                if (error) throw error;

                for (var k = 0; k < array.length; k++) {
                    var now = new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0].replace('T','-');
                    db.query('INSERT INTO experiment_images (exp_id, exp_images, created_at) VALUES (?, ?, ?)',
                        [results.insertId, array[k], now ])
                }

                db.query('select * from experiments where users_id= '+ user.user_id +'', function (error, results, fields) {
                    if (error) throw error;

                    res.render('home', {uname: user.user_name, data: results} );
                });

                // res.render('/home', {uname: user.user_name, data: results});
            });

        // db.query('SELECT * FROM experiments');
        // res.render('home', {uname: user.user_name, data: res});
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