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
            if(!productInfo.success) res.redirect('/404');
            else {
                let data = productInfo.result;
                let ownerInfo = userManager.getUserInfoById(data.ownerId);
                data = Object.assign(data, {ownerUsername: ownerInfo.result.username, location: ownerInfo.result.location})
                res.render('index', {view: 'product', username: userInfo.username, productInfo: data})
            }
        }
    }
});

module.exports = router;
