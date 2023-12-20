var express = require('express');
const userManager = require('../lib/userManager');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    if(!!!req.session.userId) res.redirect('/login?redir=' + encodeURIComponent(req.originalUrl));
    else{
        let userInfo = userManager.getUserInfoById(req.session.userId).result;
        delete userInfo.password;
        if(userInfo.isAuthed != 1) res.redirect('/emailconfirm');
        else res.render('index', {view: 'editmyinfo', username: userInfo.username, userInfo})
    }
});

module.exports = router;
