var express = require('express');
const userManager = require('../lib/userManager');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(!!!req.session.userId) res.redirect('/login?redir=' + encodeURIComponent(req.originalUrl));
    else{
        let userInfo = userManager.getUserInfoById(req.session.userId).result;
        if(userInfo?.isAuthed == 1) res.redirect('/');
        else res.render('index', {view: 'authcode'});
    }
    
});

module.exports = router;
