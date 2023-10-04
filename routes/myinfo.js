var express = require('express');
const userManager = require('../lib/userManager');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    if(!!!req.session.userId) res.redirect('/login');
    else{
        let userInfo = userManager.getUserInfoById(req.session.userId).result;
        delete userInfo.password;
        res.render('index', {
            view: 'myinfo', 
            username: userInfo.username,
            userInfo
        });
    }
});

module.exports = router;
