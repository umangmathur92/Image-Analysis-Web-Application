var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.isAuthenticated()) {
        console.log("user_id:" + JSON.stringify(req.user));
        console.log("is user authenticated:" +req.isAuthenticated());
        res.render('home');
    } else {
        res.redirect('/');
    }
});

router.get('/', authenticationMiddleware(), function(req, res) {
    res.render('home');
});

// logout
// router.post('/logout', function(req, res, next) {
//     res.send('logged out');
// });

function authenticationMiddleware() {
    return (req, res, next) => {
        // console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        res.redirect('/')
    }
}

module.exports = router;