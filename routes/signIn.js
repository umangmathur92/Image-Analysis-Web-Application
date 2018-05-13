var express = require('express');
var router = express.Router();

/* GET sign in page. */
router.get('/', function(req, res, next) {
    res.render('signIn', {title: 'sign in'});
});

// after form submission
router.post('/', function(req, res, next) {
    res.render('signIn', {title:'signed in'});
});

module.exports = router;
