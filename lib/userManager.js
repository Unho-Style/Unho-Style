const userDB = require('better-sqlite3')('./user.db');
const process = require('process')
const crypto = require('crypto')

// const userDB = mysql.createConnection({
//     host: '172.30.1.22',
//     user: process.env.DBID,
//     password: process.env.DBPW,
//     database: process.env.DBNM
// });

userDB.exec(`CREATE TABLE IF NOT EXIST users(
    'id' INTEGER NOT NULL AUTOINCREMENT PRIMARY KEY,
    'username' TEXT NOT NULL,
    'password' TEXT NOT NULL,
    'email' TEXT NOT NULL,
    'isAuthed' INTEGER NOT NULL,
    'location' INTEGER NOT NULL,
    'rate' INTEGER NOT NULL
)`);

class userManager {
    /**
     * 유저 회원가입
     * @param {string} id 사용자 ID
     * @param {string} pw 사용자 PW
     * @param {string} email 사용자 이메일 
     * @param {string} location 사용자 위치
     */
    static registerUser(id, pw, email, location) {
        pw = crypto.createHash('sha512').update(pw).digest('hex');
        const userId = userDB.prepare('SELECT * FROM sqlite_sequence WHERE name = "users";').get() + 1;
        const result = userDB.prepare('INSERT INTO users(username, password, email, isAuthed, location, rate) VALUES (?, ?, ?, 0, ?, 3.5);').run(id, pw, email,location);
        return {success: !!result.changes, userId};
    }

    /**
     * 유저 회원탈퇴
     * **사용자 인증 절차 없음**
     * @param {Number} id 사용자 ID
     */
    static unregisterUser(id) {
        const result = userDB.prepare('DELETE FROM users WHERE id = ?').run(id);
        return {success: !!result.changes}
    }

    /**
     * 사용자 ID와 해시된 PW로 유저정보를 가져옵니다.
     * @param {string} id 사용자 ID
     * @param {string} pw 사용자 PW
     */
    static getUserInfoByPassword(id, pw) {
        const result = userDB.prepare('SELECT id, username, email, location, rate FROM users WHERE username = ? AND password = ?;').all(id, pw)
        return {success: !!result, result};
    }

    /**
     * 사용자 정보를 가져옵니다.
     * @param {Number} id 사용자 고유 ID
     */
    static getUserInfoById(id) {
        const result = userDB.prepare('SELECT id, username, email, location, rate FROM users WHERE id = ?;').get(id)
        return {success: !!result, result}
    }

    static closeDB() {
        userDB.close();
    }
}

process.on('SIGINT', () => {
    userManager.closeDB();
    process.exit(0)
});

module.exports = userManager;