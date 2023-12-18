function initDB() {
    let chatDB = require('better-sqlite3')('./chat.db');
    try {
        chatDB.exec(`CREATE TABLE IF NOT EXIST chat(
            'chat_id' INTEGER NOT NULL AUTOINCREMENT PRIMARY KEY,
            'tradeId' INTEGER NOT NULL,
            'ownerId' INTEGER NOT NULL,
            'buyerId' INTEGER NOT NULL,
        )`);
        chatDB.exec(`CREATE TABLE IF NOT EXIST message(
            'message_id' INTEGER NOT NULL AUTOINCREMENT PRIMARY KEY,
            'chat_id' INTEGER NOT NULL,
            'sender_id' INTEGER NOT NULL,
            'timestamp' INTEGER NOT NULL,
            'content' TEXT NOT NULL,
            'isRead' INTEGER NOT NULL,
            FOREIGN KEY (chat_id) REFERENCES chat(chat_id),
        )`);
    }catch{}finally{
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

    static createChat(ownerId, buyerId, tradeId) {
        
    }

    /**
     * 채팅 전송
     * @param {Number} tradeId 거래글 ID
     * @param {Number} ownerId 판매자 ID
     * @param {Number} buyerId 구매자 ID
     * @param {string} content 채팅 내용
     */
    static sendChat(tradeId, ownerId, buyerId, content) { 
        let chatDB = require('better-sqlite3')('./chat.db');
        let result;
        try{
            result = chatDB.prepare('INSERT INTO chat(timestamp, tradeId, ownerId, buyerId, content, isRead) VALUES (?, ?, ?, ?, ?, 0);')
                .run(new Date().getTime(), tradeId, ownerId, buyerId, content);
        }catch{}finally{chatDB.close()}
        return {success: !!result.changes}
    }

    /**
     * 거래글 ID로 채팅 목록 반환
     * @param {Number} tradeId 
     * @param {Number} buyerId 
     * @returns {Chat[]}
     */
    static getChatsByBuyerId(tradeId, buyerId) {
        let result;
        let chatDB = require('better-sqlite3')('./chat.db');
        try{
            result = chatDB.prepare('SELECT * FROM chat WHERE id = ?').run(tradeId);
        }catch{}finally{chatDB.close()}
        return {success: !!result, result};
    }

    /**
     * 채팅 읽음 처리
     * @param {Number} chatId 채팅 ID
     */
    static readChat(chatId) { 
        let chatDB = require('better-sqlite3')('./chat.db');
        try {
            result = chatDB.prepare('UPDATE chat SET isRead = ? WHERE id = ?;').run(1, chatId);
        }catch{}finally{chatDB.close()}
        return {success: !!result.changes}
    }
}



module.exports = chatManager;