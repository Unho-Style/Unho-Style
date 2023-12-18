const tradeManager = require('../../lib/tradeManager');

module.exports = (io) => {
    var express = require('express');
    var router = express.Router();
    const chatManager = require('../../lib/chatManager');
    // const tradeManager = require('../../lib/tradeManager');
    // let socketClient = {};

    // io.on('connection', (socket) => {
    //     const session = socket.handshake.session
    //     console.log(session);
    //     // socketClient[session.userId] = socket;

    //     socket.on('chatSend', (data) => {
    //         const tradeId = data.tradeId;
    //         const content = data.content;
    //         const ownerId = tradeManager.getTrade(tradeId).ownerId;
    //         const success = chatManager.sendChat(tradeId, ownerId, socket.session.id, content).success;
    //         if(!!socketClient[ownerId]) socketClient[ownerId].emit('chatRecv', data);
    //         if(success) res.status(200).json({status: res.statusCode});
    //         else res.status(500).json({status: res.statusCode});        
    //     })
    // })

    router.get('/getChats', (req, res) => {
        if(!!!req.session.userId) {
            res.status(403).json({status: res.statusCode});
            return;
        }
        const data = chatManager.getChatsByUserId(req.session.userId);
        if(data.success) res.status(200).json({status: res.statusCode, data: data.result});
        else res.status(500).json({status: res.statusCode});        
    });

    router.get('/getMessages', (req, res) => {
        if(!!!req.session.userId) {
            res.status(403).json({status: res.statusCode});
            return;
        }
        let chatId = req.query.chatId;
        if(!!!chatId) {
            res.status(400).json({status: res.statusCode});
            return;
        }
        const data = chatManager.getMessagesByChatId(chatId);
        if(data.success) res.status(200).json({status: res.statusCode, data: data.result});
        else res.status(500).json({status: res.statusCode});
    })

    router.post('/createChat', (req, res) => {
        if(!!!req.session.userId) {
            res.status(403).json({status: res.statusCode});
            return;
        }
        let buyerId = req.session.userId;
        let tradeId = req.body?.tradeId;
        let ownerId = req.body?.ownerId;
        if(!!!tradeId || !!!ownerId) {
            res.status(400).json({status: res.statusCode, error: {message: '상품을 찾을 수 없습니다.'}});
            return;
        }else if(ownerId == buyerId){
            res.status(400).json({status: res.statusCode, error: {message: '자신이 판매중인 상품에는 채팅을 걸 수 없습니다.'}});
            return;
        }
        let data = chatManager.createChat(tradeId, ownerId, buyerId)
        if(data.success) res.status(200).json({status: res.statusCode, chat_id: data.chat_id});
        else res.status(500).json({status: res.statusCode});
    })

    router.post('/sendMessage', (req, res) => {
        if(!!!req.session.userId) {
            res.status(403).json({status: res.statusCode});
            return;
        }
        let chatId = req.body?.chatId
        let content = req.body?.content
        let senderId = req.session.userId;
        if(!!!chatid || !!!content) {
            res.status(400).json({status: res.statusCode});
            return;
        }
        let data = chatManager.sendMessage(chatId, senderId, content);
        if(data.success) res.status(200).json({status: res.statusCode, chat_id: data.chat_id});
        else res.status(500).json({status: res.statusCode});
    })

    return router;
};