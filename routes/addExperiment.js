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
        cb(null, file.fieldname + '-' + Date.now() +
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
    upload(req, res, function (err) {
        var user = req.user;

        expTitle = req.body.expTitle;
        expDate = req.body.expDate;
        expType = req.body.expType;
        expImage = req.body.expImage;

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

        console.log("user_id: " + user.user_id);
        console.log("user_name: " + user.user_name);

        console.log("expTitle: " + expTitle);
        console.log("expDate: " + expDate);
        console.log("expType: " + expType);
        // console.log("expImage: " + getFilename);

        res.render('home', {data: user.user_name});
    });

    // expTitle = req.body.expTitle;
    // expDate = req.body.expDate;
    // expType = req.body.expType;
    // expImage = req.body.expImage;
    //
    // var name=req.param("expImage");
    // console.log("name: " +name);
    //
    // var name1=req.param.expTitle;
    // console.log("name1: " +name1);
    //
    // var user = req.user;
    // console.log(user);
    // console.log("user_id: " + user.user_id);
    //
    // console.log("expTitle: " + expTitle);
    // console.log("expDate: " + expDate);
    // console.log("expType: " + expType);
    // console.log("expImage: " + expImage);

    // db.query('INSERT INTO experiments (users_id, exp_title, exp_date, exp_type) VALUES (?, ?, ?, ?)',
        //     [user.user_id, expTitle, expDate, expType], function (error, results, fields) {
        //         if (error) throw error;
        //
        //         res.redirect('/home');
        //         console.log("result:" + JSON.stringify(results));
        //     })

});

// auth middleware
function authenticationMiddleware() {
    return (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect('/')
    }
}

module.exports = router;