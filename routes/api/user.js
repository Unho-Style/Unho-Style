var express = require('express');
var router = express.Router();
const path = require('path');
const userManager = require(path.join(__dirname, 'lib/userManager'));

const 구목록 = ['학교내', '상당구', '서원구', '흥덕구', '청원구', '시외'];

router.post('/user/register', (req, res) => {
    const body = req.body;
    const result = userManager.registerUser(body.id, body.pw, body.location);
    if(result.success) {
        req.session.userId = result.userId;
        res.status(200);
    }else
        res.status(500);

    res.json({
        status: res.statusCode
    })
});

router.delete('/user/unregister', (req, res) => {
    const result = userManager.unregisterUser({id: req.session.userId});
    if(result.success) {
        req.session.userId = undefined;
        res.status(200);
    }else res.status(500);

    res.json({
        status: res.statusCode
    });
});

module.exports = router;