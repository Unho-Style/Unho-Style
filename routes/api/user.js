var express = require('express');
var router = express.Router();
const path = require('path');
const verifManager = require('../../lib/verifiedManager');
const userManager = require('../../lib/userManager');

const 구목록 = ['상당구', '서원구', '흥덕구', '청원구', '시외'];

router.post('/register', (req, res) => {
    const body = req.body;
    if(!!!body) {
        res.status(400)
        res.json({
            status: res.statusCode,
            msg: 'Request body is empty'
        });
        return;
    }
    console.log(body)
    const result = userManager.registerUser(body.id, body.password, body.email, body.location);
    console.log(result)
    if(result.success) {
        req.session.userId = result.userId;
        verifManager.sendAuthCode(result.userId, body.email);
        res.status(200);
    }else res.status(500);

    res.json({
        status: res.statusCode,
        msg: result?.msg
    })
});

router.post('/emailconfirm', (req, res) => {
    const body = req.body;
    if(!!!body) {
        res.status(400)
        res.json({
            status: res.statusCode,
            msg: 'Request body is empty'
        });
        return;
    }

    console.log(req.session.userId);
    const authcode = verifManager.getAuthCodeByUserId(req.session.userId).code;
    let msg = ''
    if(!!authcode) {
        msg = '인증번호를 요청하지 않았거나 로그인하지 않았습니다.'
        res.status(401)
    }else{
        if(authcode === body.authcode) {
            userManager.setUserAuthed(req.session.userId);
            verifManager.removeAuthCodeByUserId(req.session.userId);
            res.status(200);
        }else{
            res.status(500)
            msg = '올바르지 않은 인증번호입니다.'
        }
    }
    
    res.json({
        status: res.statusCode,
        msg: msg
    })
});

router.delete('/unregister', (req, res) => {
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