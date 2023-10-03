const process = require('process')
const crypto = require('crypto')

function initDB() {
    let userDB = require('better-sqlite3')('./user.db');
    userDB.exec(`CREATE TABLE IF NOT EXISTS users(
        'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        'username' TEXT NOT NULL UNIQUE,
        'password' TEXT NOT NULL,
        'email' TEXT NOT NULL UNIQUE,
        'isAuthed' INTEGER NOT NULL,
        'location' INTEGER NOT NULL,
        'rate' INTEGER NOT NULL
    )`);
    userDB.close();
}

initDB();

class userManager {
    /**
     * 유저 회원가입
     * @param {string} id 사용자 ID
     * @param {string} pw 사용자 PW
     * @param {string} email 사용자 이메일 
     * @param {string} location 사용자 위치
     */
    static registerUser(id, pw, email, location) {
        let userDB = require('better-sqlite3')('./user.db');
        let result;
        let msg;
        let userId;
        try {
            pw = crypto.createHash('sha512').update(pw).digest('hex');
            result = userDB.prepare('INSERT INTO users(username, password, email, isAuthed, location, rate) VALUES (?, ?, ?, 0, ?, 3.5);')
                .run(id, pw, email,location);
            userId = userDB.prepare('SELECT seq FROM sqlite_sequence WHERE name = ?;').get('users').seq
        }catch(e){
            console.log(e)
            switch(e.code) {
                case 'SQLITE_CONSTRAINT_UNIQUE':
                    msg = '이미 존재하는 아이디 혹은 이메일입니다.'
            }
        }finally{userDB.close()}
        return {success: !!result?.changes, msg, userId};
    }

    /**
     * 유저 회원탈퇴
     * **사용자 인증 절차 없음**
     * @param {Number} id 사용자 ID
     */
    static unregisterUser(id) {
        let userDB = require('better-sqlite3')('./user.db');
        let result;
        try {
            result = userDB.prepare('DELETE FROM users WHERE id = ?').run(id);
        }catch{}finally{userDB.close()}
        return {success: !!result.changes}
    }

    /**
     * 사용자 ID와 해시된 PW로 유저정보를 가져옵니다.
     * @param {string} id 사용자 ID
     * @param {string} pw 사용자 PW
     */
    static getUserInfoByPassword(id, pw) {
        let userDB = require('better-sqlite3')('./user.db');
        let result;
        try {
            result = userDB.prepare('SELECT id, username, email, location, rate FROM users WHERE username = ? AND password = ?;').all(id, pw)
        }catch{}finally{userDB.close()}
        return {success: !!result, result};
    }

    /**
     * 사용자를 인증처리 합니다.
     * @param {Number} id 사용자 고유 ID
     */
    static setUserAuthed(id) {
        let userDB = require('better-sqlite3')('./user.db');
        let result;
        try {
            result = userDB.prepare('UPDATE users SET isAuthed = 1 WHERE id = ?;').run(id)
        }catch{}finally{userDB.close()}
        return {success: !!result}
    }

    /**
     * 사용자 정보를 가져옵니다.
     * @param {Number} id 사용자 고유 ID
     */
    static getUserInfoById(id) {
        let userDB = require('better-sqlite3')('./user.db');
        let result;
        try {
            result = userDB.prepare('SELECT id, username, email, location, rate FROM users WHERE id = ?;').get(id)
        }catch{}finally{userDB.close()}
        return {success: !!result, result}
    }
}

module.exports = userManager;