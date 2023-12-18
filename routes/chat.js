var express = require('express');
const userManager = require('../lib/userManager');
const chatManager = require('../lib/chatManager');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    // req.session.userId = 1;
    if(!!!req.session.userId) res.redirect('/login');
    else{
        let userInfo = userManager.getUserInfoById(req.session.userId).result;
        res.render('index', {
            view: 'chat', 
            username: userInfo.username,
        });
    }
});

module.exports = router;
