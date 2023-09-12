const chatDB = require('better-sqlite3')('./chat.db');

chatDB.exec(`CREATE TABLE IF NOT EXIST chat(
    'id' INTEGER NOT NULL AUTOINCREMENT PRIMARY KEY,
    'timestamp' INTEGER NOT NULL,
    'tradeId' INTEGER NOT NULL,
    'ownerId' INTEGER NOT NULL,
    'content' TEXT NOT NULL,
    'isRead' INTEGER NOT NULL
)`);

class Chat {
    constructor(id, tradeId, ownerId, content, isRead) {
        this.id = id;
        this.tradeId = tradeId;
        this.ownerId = ownerId;
        this.content = content;
        this.isRead = isRead;
    }
}

class chatManager {
    /**
     * 채팅 전송
     * @param {Number} tradeId 거래글 ID
     * @param {Number} userId 전송자 ID
     * @param {string} content 채팅 내용
     */
    static uploadChat(tradeId, userId, content) { 
        const result = tradeDB.prepare('INSERT INTO chat(timestamp, tradeId, ownerId, content, isRead) VALUES (?, ?, ?, ?, 0)')
            .run(new Date().getTime(), tradeId, userId, content);
        return {success: !!result.changes}
    }

    /**
     * 거래글 ID로 채팅 목록 반환
     * @param {Number} tradeId 
     * @returns {Chat[]}
     */
    static getChatsByTradeId(tradeId) {
        const result = tradeDB.prepare('SELECT * FROM chat WHERE id = ?').run(tradeId);
        return {success: !!result, result};
    }

    /**
     * 채팅 읽음 처리
     * @param {Number} chatId 채팅 ID
     */
    static readChat(chatId) { 
        const result = tradeDB.prepare('UPDATE chat SET isRead = ? WHERE id = ?;').run(1, chatId);
        return {success: !!result.changes}
    }
}



module.exports = tradeManager;