var express = require('express');
const userManager = require('../lib/userManager');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    let userInfo = userManager.getUserInfoById(req.session.userId).result;
    if(!!!userInfo) res.redirect('/');
    else if(userInfo?.isAuthed == 1) res.redirect('/');
    else res.render('index', {view: 'authcode'});
});

module.exports = router;
