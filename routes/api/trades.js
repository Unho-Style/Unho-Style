var express = require('express');
var router = express.Router();
const tradeManager = require('../../lib/tradeManager');

//const 구목록 = ['상당구', '서원구', '흥덕구', '청원구', '시외'];

router.post('/upload', (req, res) => {
    const body = req.body;
    let msg;
    let redirID;
    if(!!!body) {
        res.status(400)
        res.json({
            status: res.statusCode,
            msg: 'Request body is empty'
        });
        return;
    }

    if(!!!req.session.userId) {
        res.status(403);
        msg = '로그인하지 않았습니다.'
    } else {
        const result = tradeManager.uploadTrade(req.session.userId, body.title, body.content, body.price, body.images, body.thumbnail, body.category)
        if(result.success) {
            res.status(200);
            redirID = result.id;
            console.log(redirID)
        }else res.status(500);
    }

    res.json({
        status: res.statusCode,
        msg: msg,
        id: redirID
    });
});

router.get('/get', (req, res) => {
    let page = req.query.page;
    const result = tradeManager.getTradesByPage(page);

    if(result.success) res.status(200);
    else res.status(500);

    res.json({
        status: res.statusCode,
        result: result?.result
    });
});

router.get('/getTradeInfo', (req, res) => {
    let tradeId = req.query.tradeId;
    const result = tradeManager.getTrade(tradeId);

    if(result.success) res.status(200);
    else res.status(500);

    res.json({
        status: res.statusCode,
        result: result?.result
    });
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
        if(!!!req.session.userId) {
            res.status(500);
            msg = '로그인하지 않았습니다.'
        } else {
            console.log(body)

            const result = tradeManager.deleteTrade(body.id, req.session.userId);
            console.log(result)
            if(result.success) {
                req.session.userId = result.result.id;
                res.status(200)
            }else{
                res.status(401)
            }
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