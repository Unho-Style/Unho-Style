var express = require('express');
const userManager = require('../lib/userManager');
const tradeManager = require('../lib/tradeManager');
var router = express.Router();

/* GET home page. */
router.get('/:productID', function(req, res, next) {
    if(!!!req.session.userId) res.redirect('/login?redir=' + encodeURIComponent(req.originalUrl));
    else{
        let userInfo = userManager.getUserInfoById(req.session.userId).result;
        if(userInfo.isAuthed != 1) res.redirect('/emailconfirm');
        else {
            let prodID = req.params.productID;
            let productInfo = tradeManager.getTrade(prodID);
            if(!productInfo.result) res.redirect('/404');
            else res.render('index', {view: 'product', username: userInfo.username, productInfo: productInfo.result})
        }
    }
});

module.exports = router;
