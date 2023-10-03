var express = require('express');
var router = express.Router();
const path = require('path');
const verifManager = require('../../lib/verifiedManager');
const userManager = require(path.join(__dirname, 'lib/userManager'));

const 구목록 = ['학교내', '상당구', '서원구', '흥덕구', '청원구', '시외'];

router.post('/user/register', (req, res) => {
    const body = req.body;
    const result = userManager.registerUser(body.id, body.pw, body.email, body.location);
    if(result.success) {
        req.session.userId = result.userId;
        verifManager.sendAuthCode(result.userId, body.email);
        res.status(200);
    }else res.status(500);

    res.json({
        status: res.statusCode
    })
});

router.post('/user/emailconfirm', (req, res) => {
    const body = req.body;
    const authcode = verifManager.getAuthCodeByUserId(req.session.userId);
    let msg = ''
    if(!!authcode) {
        msg = '인증번호를 요청하지 않았거나 로그인하지 않았습니다.'
    }else{
        if(authcode === body.authcode) {
            userManager.setUserAuthed(req.session.userid);
            res.status(200);
        }else{
            res.status(500)
            msg = '올바르지 않은 인증번호입니다.'
        }
    }
    
    res.json({
        status: res.statusCode
    })
});

router.delete('/user/unregister', (req, res) => {
    const result = userManager.unregisterUser({id: req.session.userId});
    if(result.success) {
        req.session.userId = undefined;
        res.status(200);
    }else res.status(500);

    res.json({
        status: res.statusCode
    });
});

module.exports = router;