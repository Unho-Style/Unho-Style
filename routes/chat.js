var express = require('express');
const userManager = require('../lib/userManager');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    // req.session.userId = 1;
    if(!!!req.session.userId) res.redirect('/login?redir=' + encodeURIComponent(req.originalUrl));
    else{
        let userInfo = userManager.getUserInfoById(req.session.userId).result;
        if(userInfo.isAuthed != 1) res.redirect('/emailconfirm');
        else res.render('index', {view: 'chat', username: userInfo.username})
    }
});

module.exports = router;
