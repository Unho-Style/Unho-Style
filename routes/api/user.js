var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const verifManager = require('../../lib/verifiedManager');
const userManager = require('../../lib/userManager');

//const 구목록 = ['상당구', '서원구', '흥덕구', '청원구', '시외'];

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
    const result = userManager.registerUser(body.id, body.password, body.email, body.location);
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

router.patch('/update', (req, res) => {
    const body = req.body;
    if(!!!body) {
        res.status(400)
        res.json({
            status: res.statusCode,
            msg: 'Request body is empty'
        });
        return;
    }
    let msg;
    if(!!!req.session.userId) {
        res.status(500);
        msg = '로그인하지 않았습니다.'
    } else {
        let userInfo = userManager.getUserInfoById(req.session.userId);
        let hashPW = crypto.createHash('sha512').update(body['prev_pw']).digest('hex');
        if(userInfo.result.password == hashPW) {
            let result = userManager.updateUser(req.session.userId, body.password, body.location)
            if(result) res.status(200);
            else {
                res.status(500);
                msg = result.msg
            }
        }else{
            res.status(403);
            msg = '이전 비밀번호가 일치하지 않습니다.'
        }
    }

    res.json({
        status: res.statusCode,
        msg
    });
});

router.post('/resendcode', (req, res) => {
    try {
        let userInfo = userManager.getUserInfoById(req.session.userId).result;
        console.log(userInfo)
        if(!!!userInfo) throw new Error();
        verifManager.sendAuthCode(req.session.userId, userInfo.email);
        res.status(200).json({
            status: res.statusCode
        })
    }catch(e) {
        res.status(500).json({
            status: res.statusCode
        })
    }
});

router.post('/login', (req, res) => {
    try {
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

        let hashPW = crypto.createHash('sha512').update(body.password).digest('hex');
        const result = userManager.getUserInfoByPassword(body.id, hashPW)
        console.log(result)
        if(result.success) {
            req.session.userId = result.result.id;
            res.status(200)
        }else{
            res.status(401)
        }
    }catch(e){
        console.log(e)
        res.status(500)
    }
    res.json({
        status: res.statusCode
    });
});

router.get('/logout', (req, res) => {
    req.session.userId = undefined;
    res.redirect('/');
});

router.post('/pushSubscribe', (req, res) => {
    try {
        let subscribeInfo = req.body;
        userManager.subscribePushNoti(req.session.userId, subscribeInfo);
        res.status(200).json({
            status: res.statusCode
        })
    }catch{
        res.status(500).json({
            status: res.statusCode
        });
    }
})

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