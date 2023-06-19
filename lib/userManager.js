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
    'userName' TEXT NOT NULL,
    'userPw' TEXT NOT NULL,
    'location' TEXT NOT NULL,
    'grade' INT NOT NULL
)`);

class User {
    constructor(id, userName, userPw, location, grade) {
        this.id = id;
        this.userName = userName;
        this.userPw = userPw;
        this.location = location;
        this.grade = grade;
    }
}

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
            'INSERT INTO users(userName, userPw, location) VALUES (?, ?, ?, "", 0);', 
            [id, pw, location],
            (err, row, field) => {
                return {success: !!!err, err}
            }
        )
    }

    /**
     * 유저 회원탈퇴
     * @param {User} user 사용자 객체
     */
    static async unregisterUser(user) {
        userDB.query(
            'DELETE INTO users VALUES (?, ?, ?, "", 0);', 
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
            'SELECT * FROM users where userName = ? AND userPw = ?;', 
            [id, pw],
            (err, row, field) => {
                return {success: !!!err, result: row}
            }
        )
    }

    /**
     * 사용자 정보를 가져옵니다.
     * @param {Number} id 사용자 고유 ID
     */
    static async getUserInfo(id) {
        userDB.query(
            'SELECT * FROM users where id = ?;', 
            [id],
            (err, row, field) => {
                const e = row[0];
                return {success: !!!err, result: new User(e?.id, e?.userName, null, e?.location, e?.grade)}
            }
        )
    }
}

module.exports = userManager;