const mysql = require('mysql');
const process = require('process')
const crypto = require('crypto')

const userDB = mysql.createConnection({
    host: '172.30.1.22',
    user: process.env.DBID,
    password: process.env.DBPW,
    database: process.env.DBNM
});

userDB.query(`CREATE TABLE IF NOT EXIST users(
    'id' INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    'userId' TEXT NOT NULL,
    'userPw' TEXT NOT NULL,
    'location' TEXT NOT NULL,
    'grade' INT NOT NULL
)`);

class userManager {
    /**
     * 유저 회원가입
     * @param {string} id 사용자 ID
     * @param {string} pw 사용자 PW
     * @param {string} location 사용자 위치
     */
    static async registerUser(id, pw, location) {
        pw = crypto.createHash('sha512').update(pw).digest('hex');
        userDB.query(
            'INSERT INTO users(userId, userPw, location) VALUES (?, ?, ?, "", 0);', 
            [id, pw, location],
            (err, row, field) => {
                return {success: !!!err, err}
            }
        )
    }

    /**
     * 유저 회원탈퇴
     * @param {int} id 사용자 고유 ID
     */
    static async unregisterUser(id, pw, location) {
        pw = crypto.createHash('sha512').update(pw).digest('hex');
        userDB.query(
            'INSERT INTO users(userId, userPw, location) VALUES (?, ?, ?, "", 0);', 
            [id, pw, location],
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