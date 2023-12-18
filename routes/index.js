var express = require('express');
const userManager = require('../lib/userManager');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(!!req.session.userId) {
        // TODO: 가입 사용자 메인 페이지 표시
        let userInfo = userManager.getUserInfoById(req.session.userId).result;
        if(userInfo.isAuthed == 1) {
            res.render('index', {view: 'main', username: userInfo.username})
        }else{
            res.redirect('/emailconfirm')
        }
    }else{
        // TODO: 회원가입 페이지 표시
        res.render('index', {view: 'needregister'})
    }
});

module.exports = router;
