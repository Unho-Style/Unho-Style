const tradeManager = require('../../lib/tradeManager');

module.exports = (io) => {
    var express = require('express');
    var router = express.Router();
    const chatManager = require('../../lib/chatManager');

    router.get('/getChats', (req, res) => {
        if(!!!req.session.userId) {
            res.status(403).json({status: res.statusCode});
            return;
        }
        const data = chatManager.getChatsByUserId(req.session.userId);
        if(data.success) res.status(200).json({status: res.statusCode, data: data.result});
        else res.status(500).json({status: res.statusCode});        
    });

    router.get('/getChatById', (req, res) => {
        if(!!!req.session.userId) {
            res.status(403).json({status: res.statusCode});
            return;
        }
        const data = chatManager.getChatByChatId(req.query.chatId);
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
        if(data.success) {
            let result = data.result;
            result.map(e => {
                if(e.sender_id == req.session.userId) e.isMe = true;
                else e.isMe = false;
            })
            res.status(200).json({status: res.statusCode, data: data.result});
        }
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
        let prevChatID = chatManager.getChatIdFor(tradeId, ownerId, buyerId);
        if(prevChatID.success) {
            res.status(200).json({status: res.statusCode, chat_id: prevChatID.chat_id});
        }else {
            let data = chatManager.createChat(tradeId, ownerId, buyerId);
            if(data.success) res.status(200).json({status: res.statusCode, chat_id: data.chat_id});
            else res.status(500).json({status: res.statusCode});
        }
    })

    router.post('/sendMessage', (req, res) => {
        if(!!!req.session.userId) {
            res.status(403).json({status: res.statusCode});
            return;
        }
        let chatId = req.body?.chatId
        let content = req.body?.content
        let senderId = req.session.userId;
        if(!!!chatId || !!!content) {
            res.status(400).json({status: res.statusCode});
            return;
        }
        let data = chatManager.sendMessage(chatId, senderId, content);
        if(data.success) res.status(200).json({status: res.statusCode});
        else res.status(500).json({status: res.statusCode});
    })

    return router;
};