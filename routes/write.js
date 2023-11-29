var express = require('express');
const userManager = require('../lib/userManager');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    // if(!!!req.session.userId) res.redirect('/login');
    if (false) return;
    else{
        req.session.userId = 1;
        let userInfo = userManager.getUserInfoById(req.session.userId).result;
        delete userInfo.password;
        res.render('index', {
            view: 'write', 
            username: userInfo.username,
            userInfo
        });
    }
});

module.exports = router;
