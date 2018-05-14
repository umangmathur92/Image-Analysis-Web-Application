var express = require('express');
var router = express.Router();
const db = require('../helpers/db');

/* GET sign in page. */
router.get('/', function(req, res, next) {
    res.render('signIn');
});

// after form submission
router.post('/', function(req, res, next) {

    db.query('select * from users;', function (err, results, fields) {
        console.log('connected');
        if (err) throw err;
        console.log("result:" + JSON.stringify(results));
    });
    res.render('signIn');
});

module.exports = router;