function initDB() {
    let tradeDB = require('better-sqlite3')('./trade.db');
    tradeDB.exec(`CREATE TABLE IF NOT EXISTS trade(
        'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        'ownerId' INTEGER NOT NULL,
        'price' INTEGER NOT NULL,
        'title' TEXT NOT NULL,
        'content' TEXT NOT NULL,
        'status' INTEGER NOT NULL,
        'buyer_id' INTEGER,
        'category' INTEGER NOT NULL,
        'timestamp' INTEGER NOT NULL,
        'images' TEXT NOT NULL,
        'thumbnail' TEXT NOT NULL,
        'view' INTEGER NOT NULL,
        'heart' INTEGER NOT NULL
    )`);
}

initDB();


class Trade {
    constructor(id, ownerId, price, title, content, status, category, timestamp, images, view, heart) {
        this.id = id;
        this.ownerId = ownerId;
        this.title = title;
        this.price = price;
        this.content = content;
        this.status = status
        this.category = category
        this.timestamp = timestamp
        this.images = images
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
     * @param {Number} price 상품 가격
     * @param {Array} images 상품 이미지
     * @param {Number} images 상품 종류
     */
    static uploadTrade(userId, title, content, price, images, thumbnail, category) { 
        let tradeDB = require('better-sqlite3')('./trade.db');
        let result;
        let id;
        try {

            result = tradeDB.prepare(`INSERT INTO trade(ownerId, price, title, content, status, category, timestamp, images, thumbnail, view, heart) ` + 
                                     `VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0);`)
                .run(userId, price, title, content, 0, category, new Date().getTime(), JSON.stringify(images), thumbnail);
            id = tradeDB.prepare('SELECT seq FROM sqlite_sequence WHERE name = ?;').get('trade').seq;
        }catch(e){console.error(e)}finally{tradeDB.close()}
        return {success: !!result?.changes, id}
    }

    /**
     * 거래글 삭제
     * **사용자 인증 절차 없음**
     * @param {Number} tradeId 거래글 ID
     * @param {Number} ownerId 게시자 ID
     */
    static deleteTrade(tradeId, ownerId) {
        let tradeDB = require('better-sqlite3')('./trade.db');
        let result;
        try {
            result = tradeDB.prepare('DELETE FROM trade WHERE id = ? AND ownerId = ?').run(tradeId, ownerId);
        }catch{}finally{tradeDB.close()}
        return {success: !!result.changes}
    }

    /**
     * 페이지에 따라 거래글 얻기
     * (페이지당 20개)
     * @param {Number} page 페이지
     */
    static getTradesByPage(page) { 
        let tradeDB = require('better-sqlite3')('./trade.db');
        let result;
        try {
            page = parseInt(page);
            result = tradeDB.prepare('SELECT * FROM trade ORDER BY id DESC LIMIT ?, 20;').all((page - 1) * 19);
        }catch(e){console.error(e)}finally{tradeDB.close()}
        return {success: !!result, result}
    }

    /**
     * tradeId로 거래글 얻기
     * @param {Number} tradeId 
     */
    static getTrade(tradeId) { 
        let tradeDB = require('better-sqlite3')('./trade.db');
        let result;
        try {
            result = tradeDB.prepare('SELECT * FROM trade WHERE id = ?;').get(tradeId);
        }catch{}finally{tradeDB.close()}
        return {success: !!result, result}
    }

    /**
     * ownerId로 거래글 얻기
     * @param {Number} ownerId
     */
    static getTradesByOwnerId(tradeId) { 
        let tradeDB = require('better-sqlite3')('./trade.db');
        let result;
        try {
            result = tradeDB.prepare('SELECT * FROM trade WHERE ownerId = ?;').all(tradeId);
        }catch{}finally{tradeDB.close()}
        return {success: !!result, result}
    }

    /**
     * buyerId로 거래글 얻기
     * @param {Number} buyerId
     */
    static getTradesByBuyerId(buyerId) { 
        let tradeDB = require('better-sqlite3')('./trade.db');
        let result;
        try {
            result = tradeDB.prepare('SELECT * FROM trade WHERE buyer_id = ?;').all(buyerId);
        }catch{}finally{tradeDB.close()}
        return {success: !!result, result}
    }

    /**
     * 거래글 정보 갱신
     * **사용자 인증 절차 없음**
     * @param {Number} tradeId 거래글 ID
     * @param {Number} status 거래 상태
     * @param {Number} buyerId 구매자/예약자 ID
     */
    static updateTrade(tradeId, status, buyerId) { 
        let tradeDB = require('better-sqlite3')('./trade.db');
        let result;
        try {
            result = tradeDB.prepare('UPDATE trade SET status = ?, buyer_id = ? WHERE id = ?;').run(status, buyerId, tradeId);
        }catch{}finally{tradeDB.close()}
        return {success: !!result.changes}
    }
}

module.exports = tradeManager;