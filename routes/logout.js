var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function (req, res, next) {
    req.logOut();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
