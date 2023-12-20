var express = require('express');
var router = express.Router();
const tradeManager = require('../../lib/tradeManager');
const chatManager = require('../../lib/chatManager');

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
    try {
        let userId = req.session.userId;
        let body = req.body;
        let tradeId = body.tradeId;
        let chatId = body.chatId;
        let status = body.status;
        let tradeInfo = tradeManager.getTrade(tradeId);
        let chatInfo = chatManager.getChatByChatId(chatId);
        // console.log(body)
        // console.log(tradeInfo, chatInfo)
        if(tradeInfo.result && chatInfo.result) {
            if(tradeInfo.result.ownerId != userId) res.status(403).json({status: req.statusCode});
            else {
                tradeManager.updateTrade(tradeId, status, chatInfo.result.buyer_id);
                res.status(200).json({status: res.statusCode})
            }
        }else throw new Error();
    }catch(e){
        console.error(e);
        res.status(500).json({status: res.statusCode});
    }
});

module.exports = router;