const userManager = require('../../lib/userManager');
const sharp = require('sharp');
var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs')
const appRoot = require('app-root-path').path;

// var storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, path.join(appRoot, 'public', 'files'));
// 	},
// 	filename: function (req, file, cb) {
//         let filename = new Date().getTime() + '_' + file.originalname.normalize('NFC').replace(/ /g, '_');
// 		cb(null, filename.substring(0, filename.lastIndexOf(".")) + '.webp');
// 	}
// });

if(!fs.existsSync(path.join(appRoot, 'public', 'files'))) {
    fs.mkdirSync(path.join(appRoot, 'public', 'files'));
}



var upload = multer();

router.post('/', function(req, res, next) {
	if(!!req.session.userId) {
		upload.single('upload')(req, res, async (err) => {
			if(!req.file) {
				res.status(400);
				res.send({
					'status': res.statusCode,
                    error: {
                        'message': '파일이 누락되었습니다.',
                    }
				});
			}else if(!!err) {
                res.status(500);
                res.send({
                    status: res.statusCode,
                    error: {
                        message: '파일 업로드에 실패했습니다.',
                    }
                });
            }else{
                console.log(req.file);
                let userInfo = userManager.getUserInfoById(req.session.userId).result;
                let wmText = `UNHOS - ${userInfo.username}님의 판매글`

                let filename = new Date().getTime() + '_' + req.file.originalname.normalize('NFC').replace(/ /g, '_');
                filename = filename.substring(0, filename.lastIndexOf(".")) + '.webp';
                let savePath = path.join(appRoot, 'public', 'files', filename);
                console.log(savePath);
                let width = await require('image-size')(req.file.buffer).width;
                const watermark = await sharp({
                    text: {
                        text: `<span foreground="#bdbdbd80">${wmText}</span>`,
                        font: 'sans',
                        align: 'center',
                        width: width,
                        // height: 14,
                        rgba: true,
                        dpi: 150
                    }
                }).png().toBuffer();
                await sharp(req.file.buffer).composite([{
                    input: watermark,
                    gravity: 'center'
                }]).webp().toFile(savePath);

                res.send({
                    'status': res.statusCode,
                    'url': '/files/' + req.file.filename,
                });
			}
		});
	}else{
		res.status(403);
		res.send({
			'status': res.statusCode,
            error: {
    			'message': '권한 거부',
            }
		});
	}
});

module.exports = router;