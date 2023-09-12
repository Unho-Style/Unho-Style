const tradeDB = require('better-sqlite3')('./chat.db');
const process = require('process')
const crypto = require('crypto')

tradeDB.exec(`CREATE TABLE IF NOT EXIST trade(
    'id' INTEGER NOT NULL AUTOINCREMENT PRIMARY KEY,
    'ownerId' INTEGER NOT NULL,
    'price' INTEGER NOT NULL,
    'title' TEXT NOT NULL,
    'content' TEXT NOT NULL,
    'status' TEXT NOT NULL,
    'category' INTEGER NOT NULL,
    'timestamp' INTEGER NOT NULL,
    'photos' TEXT NOT NULL,
    'view' INTEGER NOT NULL,
    'heart' INTEGER NOT NULL
)`);


class Trade {
    constructor(id, ownerId, price, title, content, status, category, timestamp, photos, view, heart) {
        this.id = id;
        this.ownerId = ownerId;
        this.title = title;
        this.price = price;
        this.content = content;
        this.status = status
        this.category = category
        this.timestamp = timestamp
        this.photos = photos
        this.view = view;
        this.heart = heart;
    }
}

class tradeManager {
    /**
     * 거래글 게시
     * @param {Number} userId 사용자 ID
     * @param {string} title 상품 제목
     * @param {string} content 상품 정보
     */
    static uploadTrade(userId, title, content) { 
        const result = tradeDB.prepare('INSERT INTO trade(status, ownerId, title, content, view, heart) VALUES (0, ?, ?, ?, 0, 0)')
            .run(userId, title, content);
        return {success: !!result.changes}
    }

    /**
     * 거래글 삭제
     * **사용자 인증 절차 없음**
     * @param {Number} tradeId 거래글 ID
     */
    static deleteTrade(tradeId) { 
        const result = tradeDB.prepare('DELETE FROM trade WHERE id = ?').run(tradeId);
        return {success: !!result.changes}
    }

    /**
     * 페이지에 따라 거래글 얻기
     * (페이지당 20개)
     * @param {Number} page 페이지
     * @returns {Trade[]}
     */
    static getTradesByPage(page) { 
        const result = tradeDB.prepare('SELECT * FROM trade WHERE id = ? LIMIT 20 OFFSET ?;').run(tradeId, (page === 1 ? 0 : page * 24));
        return {success: !!result, result}
    }

    /**
     * tradeId로 거래글 얻기
     * @param {Number} tradeId 
     * @returns {Trade} 거래글 정보
     */
    static getTrade(page) { 
        const result = tradeDB.prepare('SELECT * FROM trade WHERE id = ? LIMIT 20 OFFSET ?;').run(tradeId, (page === 1 ? 0 : page * 24));
        return {success: !!result, result}
    }

    /**
     * 거래글 정보 갱신
     * **사용자 인증 절차 없음**
     * @param {Number} tradeId 거래글 ID
     * @param {JSON} status 거래 상태
     */
    static updateTrade(tradeId, status) { 
        const result = tradeDB.prepare('UPDATE trade SET status = ? WHERE id = ?;').run(status, tradeId);
        return {success: !!result.changes}
    }
}

process.on('SIGINT', () => {
    chatManager.closeDB();
    process.exit(0)
});

module.exports = tradeManager;