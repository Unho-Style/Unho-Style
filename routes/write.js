var express = require('express');
const userManager = require('../lib/userManager');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (!!!req.session.userId) {
        res.redirect('/')
    }else{
        let userInfo = userManager.getUserInfoById(req.session.userId).result;
        res.render('index', {
            view: 'write', 
            username: userInfo.username,
        });
    }
});

module.exports = router;
