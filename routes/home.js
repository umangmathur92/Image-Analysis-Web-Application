var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.isAuthenticated()) {
        console.log("user_id:" + JSON.stringify(req.user));
        console.log("is user authenticated:" + req.isAuthenticated());
        res.render('home');
    } else {
        res.redirect('/');
    }
});

module.exports = router;