const userManager = require('./userManager');

function initDB() {
    let chatDB = require('better-sqlite3')('./chat.db');
    try {
        chatDB.exec(`CREATE TABLE IF NOT EXISTS chat(
            'chat_id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            'trade_id' INTEGER NOT NULL,
            'owner_id' INTEGER NOT NULL,
            'buyer_id' INTEGER NOT NULL,
            'last_message_timestamp' INTEGER,
            'last_message' TEXT
        )`);
        chatDB.exec(`CREATE TABLE IF NOT EXISTS message(
            'message_id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            'chat_id' INTEGER NOT NULL,
            'sender_id' INTEGER NOT NULL,
            'timestamp' INTEGER NOT NULL,
            'content' TEXT NOT NULL,
            'isRead' INTEGER NOT NULL,
            FOREIGN KEY (chat_id) REFERENCES chat(chat_id)
        )`);
    }catch(e){console.error(e)}finally{
        chatDB.close();
    }
}

initDB();

class Chat {
    constructor(id, tradeId, buyerId, ownerId, content, isRead) {
        this.id = id;
        this.tradeId = tradeId;
        this.ownerId = ownerId;
        this.buyerId = buyerId;
        this.content = content;
        this.isRead = isRead;
    }
}

class chatManager {
    /**
     * 채팅방 생성
     * @param {number} tradeId 거래 ID
     * @param {number} ownerId 판매자 ID
     * @param {number} buyerId 구매자 ID
     * @returns 
     */
    static createChat(tradeId, ownerId, buyerId) {
        let chatDB = require('better-sqlite3')('./chat.db');
        let result;
        let chat_id;
        try{
            result = chatDB.prepare('INSERT INTO chat(trade_id, owner_id, buyer_id) VALUES (?, ?, ?);')
                .run(tradeId, ownerId, buyerId);
            chat_id = chatDB.prepare('SELECT seq FROM sqlite_sequence WHERE name = ?;')
                .get('chat').seq;
        }catch{}finally{chatDB.close()}
        return {success: !!result.changes, chat_id};
    }

    /**
     * 채팅방 생성
     * @param {number} tradeId 거래 ID
     * @param {number} ownerId 판매자 ID
     * @param {number} buyerId 구매자 ID
     */
    static getChatIdFor(tradeId, ownerId, buyerId) {
        let chatDB = require('better-sqlite3')('./chat.db');
        let result;
        let chat_id;
        try{
            chat_id = chatDB.prepare('SELECT * FROM chat WHERE trade_id = ? AND owner_id = ? AND buyer_id = ?;')
                .get(tradeId, ownerId, buyerId)?.chat_id;
        }catch{}finally{chatDB.close()}
        return {success: !!chat_id, chat_id};
    }

    /**
     * 채팅 전송
     * @param {Number} chatId 채팅 ID
     * @param {Number} senderId 전송자 ID
     * @param {string} content 채팅 내용
     */
    static sendMessage(chatId, senderId, content) { 
        let chatDB = require('better-sqlite3')('./chat.db');
        let result;
        try{
            result = chatDB.prepare('INSERT INTO message(chat_id, sender_id, timestamp, content, isRead) VALUES (?, ?, ?, ?, 0);')
                .run(chatId, senderId, new Date().getTime(), content);
            chatDB.prepare('UPDATE chat SET last_message_timestamp = ?, last_message = ? WHERE chat_id = ?;')
                .run(new Date().getTime(), content, chatId);

            let tradeInfo = chatDB.prepare('SELECT * FROM chat WHERE chat_id = ?;')
                .get(chatId);
            let recevicerId;
            if(tradeInfo.owner_id == senderId) recevicerId = tradeInfo.buyer_id;
            else recevicerId = tradeInfo.owner_id;
            let senderInfo = userManager.getUserInfoById(senderId)?.result;
            console.log(senderInfo);
            userManager.sendPushNoti(chatId, senderId, senderInfo.username, recevicerId, content);
        }catch{}finally{chatDB.close()}
        return {success: !!result.changes}
    }

    /**
     * 채팅 ID로 메시지 내역 반환
     * @param {Number} chatId  
     */
    static getMessagesByChatId(chatId) {
        let result;
        let chatDB = require('better-sqlite3')('./chat.db');
        try{
            result = chatDB.prepare('SELECT * FROM message WHERE chat_id = ? ORDER BY timestamp ASC;').all(chatId);
        }catch{}finally{chatDB.close()}
        return {success: !!result, result};
    }

    /**
     * 사용자 ID로 채팅방 목록 반환
     * @param {Number} userId  
     */
    static getChatsByUserId(userId) {
        let result;
        let chatDB = require('better-sqlite3')('./chat.db');
        try{
            result = chatDB.prepare('SELECT * FROM chat WHERE buyer_id = ? OR owner_id = ? ORDER BY last_message_timestamp DESC').all(userId, userId);
            result.map((e) => {
                let username;
                if(userId == e.owner_id) username = userManager.getUserInfoById(e.owner_id).result.username
                else if(userId == e.buyer_id) username = userManager.getUserInfoById(e.buyer_id).result.username
                delete e.owner_id;
                delete e.buyer_id;
                e.username = username;
                return e;
            })
        }catch(e){console.log(e)}finally{chatDB.close()}
        return {success: !!result, result};
    }

    /**
     * 채팅방 ID로 채팅방 반환
     * @param {Number} chatId  
     */
    static getChatByChatId(chatId) {
        let result;
        let chatDB = require('better-sqlite3')('./chat.db');
        try{
            result = chatDB.prepare('SELECT * FROM chat WHERE chat_id = ?;').get(chatId);
        }catch{}finally{chatDB.close()}
        return {success: !!result, result};
    }

    /**
     * 채팅 읽음 처리
     * @param {Number} messageid 메시지 ID
     */
    static readMessage(chatId) { 
        let chatDB = require('better-sqlite3')('./chat.db');
        let result;
        try {
            result = chatDB.prepare('UPDATE message SET isRead = ? WHERE message_id = ?;').run(1, chatId);
        }catch{}finally{chatDB.close()}
        return {success: !!result.changes}
    }
}



module.exports = chatManager;