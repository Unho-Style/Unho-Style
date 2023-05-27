const mysql = require('mysql');
const process = require('process')
const crypto = require('crypto')

const userDB = mysql.createConnection({
    host: '172.30.1.22',
    user: process.env.DBID,
    password: process.env.DBPW,
    database: process.env.DBNM
});

userDB.query(`CREATE TABLE IF NOT EXIST trade(
    'id' INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    'ownerId' INT NOT NULL,
    'title' TEXT NOT NULL,
    'content' JSON NOT NULL,
    'view' INT NOT NULL
    'heart' INT NOT NULL
)`);

class userManager {
    /**
     * 거래글 게시
     * @param {Number} userId 사용자 ID
     * @param {string} title 상품 제목
     * @param {JSON} content 상품 정보
     */
    static async registerUser(userId, title, content) {
        userDB.query(
            'INSERT INTO trade(ownerId, title, content, view, heart) VALUES (?, ?, ?, 1, 0);', 
            [userId, title, content],
            (err, row, field) => {
                return {success: !!!err, err}
            }
        )
    }

    /**
     * 사용자 ID와 PW로 유저정보를 가져옵니다.
     * @param {string} id 사용자 ID
     * @param {string} pw 사용자 PW
     */
    static async getUserInfo(id, pw) {
        userDB.query(
            'SELECT * FROM users where userId = ? AND userPw = ?;', 
            [id, pw],
            (err, row, field) => {
                return {success: !!!err, result: row}
            }
        )
    }

    /**
     * 사용자 고유 ID 유저정보를 가져옵니다.
     * @param {string} id 사용자 ID
     * @param {string} pw 사용자 PW
     */
    static async getUserInfo(id) {
        userDB.query(
            'SELECT * FROM users where id = ?;', 
            [id],
            (err, row, field) => {
                return {success: !!!err, result: row}
            }
        )
    }
}

module.exports = userManager;