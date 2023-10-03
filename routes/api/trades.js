var express = require('express');
var router = express.Router();
const tradeManager = require('../../lib/tradeManager');

//const 구목록 = ['상당구', '서원구', '흥덕구', '청원구', '시외'];

router.post('/upload', (req, res) => {
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

router.delete('/remove', (req, res) => {
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

router.post('/changestatus', (req, res) => {
    req.session.userId = undefined;
    res.send('');
});

module.exports = router;