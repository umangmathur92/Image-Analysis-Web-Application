var express = require('express');
var router = express.Router();

/* GET sign up page. */
router.get('/', function(req, res, next) {
    res.render('signUp', {title: 'sign up'});
});

// after form submission
router.post('/', function(req, res, next) {
    res.render('signUp', {title:'signed up'});
});

module.exports = router;