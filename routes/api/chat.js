module.exports = (io) => {
    var express = require('express');
    var router = express.Router();
    const chatManager = require('../../lib/chatManager');
    const tradeManager = require('../../lib/tradeManager');
    let socketClient = {};

    io.on('connection', (socket) => {
        const session = socket.handshake.session
        console.log(session);
        // socketClient[session.userId] = socket;

        socket.on('chatSend', (data) => {
            const tradeId = data.tradeId;
            const content = data.content;
            const ownerId = tradeManager.getTrade(tradeId).ownerId;
            const success = chatManager.sendChat(tradeId, ownerId, socket.session.id, content).success;
            if(!!socketClient[ownerId]) socketClient[ownerId].emit('chatRecv', data);
            if(success) res.status(200).json({status: res.statusCode});
            else res.status(500).json({status: res.statusCode});        
        })
    })

    router.get('/getChats', (req, res) => {
        const data = chatManager.getChatsByBuyerId(req.query.tradeId, req.session.id);
        if(data.success) res.status(200).json({status: res.statusCode, data});
        else res.status(500).json({status: res.statusCode});        
    });

    router.post('/createChat', (req, res) => {
        
    })

    router.post('/sendChat', (req, res) => {
        
    })

    return router;
};