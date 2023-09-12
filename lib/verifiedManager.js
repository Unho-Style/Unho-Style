const authDB = require('better-sqlite3')('./auth.db');
const transporter = require('nodemailer').createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'unhostyle@gmail.com',
        pass: '6435-7768Unhostyle'
    }
});

verifDB.exec(`CREATE TABLE IF NOT EXIST authCode(
    'userId' INTEGER NOT NULL,
    'timestampExp' INTEGER NOT NULL,
    'code' INTEGER NOT NULL
)`);

function getRandomInt() {
    return Math.floor(Math.random() * 10);
}
  

function getRandomCode() {
    const code = [];
    for(let i = 0; i < 6; i++) code.push(getRandomInt())
    return code.join('');
}

class verifManager {
    static sendAuthCode(userId, email) {
        let expTime = new Date();
        const authCode = getRandomCode();
        expTime.setMinutes(expTime.getMinutes() + 10);
        const result = verifDB.prepare('INSERT INTO authCode(userId, timestampExp, code) VALUES (?, ?, ?)')
            .run(userId, expTime.getTime(), authCode);
        transporter.sendMail({
            from: 'Unho Style',
            to: email,
            subject: '[Unho Style] 회원가입 인증번호입니다.',
            text: 
            `<h2>Unho Style에 오신것을 진심으로 환영합니다!</h2>
            <p>아래 인증코드를 입력해서 회원가입을 완료하세요.</p>
            <p>${authCode}</p>
            <br/>
            <p>* 인증코드는 10분동안만 유효합니다.</p>`
        });
        
        return {success: !!result.changes}
    }

    static getAuthCodeByUserId(userId) {
        const result = userDB.prepare('SELECT * FROM authCode WHERE userId = ?;').get(userId)
        return {success: !!result, result}
    }
}



module.exports = verifManager;