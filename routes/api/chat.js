module.exports = (io) => {
    var express = require('express');
    var router = express.Router();
    const chatManager = require('../../lib/chatManager');
    const tradeManager = require('../../lib/tradeManager');

    io.on('connection', (socket) => {
        const session = socket.request.session;
    })

    router.get('/getChats', (req, res) => {
        const data = chatManager.getChatsByBuyerId(req.query.tradeId, req.session.id);
        if(data.success) res.status(200).json({status: res.statusCode, data});
        else res.status(500).json({status: res.statusCode});        
    })

    router.post('/sendChat', (req, res) => {
        const ownerId = tradeManager.getTrade(req.query.tradeId).ownerId;
        const data = chatManager.sendChat(req.query.tradeId, ownerId, req.session.id, req.body.content);
        if(data.success) res.status(200).json({status: res.statusCode});
        else res.status(500).json({status: res.statusCode});        
    })

    return router;
};