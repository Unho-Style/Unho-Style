var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(!!req.session.userId) {
        // TODO: 가입 사용자 메인 페이지 표시
        res.render('index', {view: 'main'})
    }else{
        // TODO: 회원가입 페이지 표시
        res.render('index', {view: 'needregister'})
    }
});

module.exports = router;
