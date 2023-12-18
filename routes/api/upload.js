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
                try {
                    let userInfo = userManager.getUserInfoById(req.session.userId).result;
                    let wmText = `UNHOS - ${userInfo.username}님의 판매글`
                    let convertFile = await sharp(req.file.buffer).webp({
                        quality: 90
                    }).toBuffer();
                    let filename = new Date().getTime() + '_' + req.file.originalname.normalize('NFC').replace(/ /g, '_');
                    filename = filename.substring(0, filename.lastIndexOf(".")) + '.webp';
                    let savePath = path.join(appRoot, 'public', 'files', filename);
                    let imgSize = await require('image-size')(convertFile);
                    console.log(path.join(appRoot, 'NotoSansKR-Bold.ttf'));
                    const watermark = await sharp({
                        text: {
                            text: `<span foreground="#bdbdbd80">${wmText}</span>`,
                            // fontfile: path.join(appRoot, 'NotoSansKR-Bold.ttf'),
                            font: 'sans',
                            align: 'center',
                            width: imgSize.width,
                            height: imgSize.height * 0.05,
                            rgba: true,
                            // dpi: 150
                        }
                    }).png().toBuffer();
                    await sharp(convertFile).composite([{
                        input: watermark,
                        gravity: 'center'
                    }]).webp().toFile(savePath);

                    res.send({
                        'status': res.statusCode,
                        'url': '/files/' + filename,
                    });
                }catch(e){
                    console.error(e);
                    res.status(500).json({
                        status: res.statusCode,
                        error: {
                            message: '파일 업로드에 실패했습니다.',
                        }
                    })
                }
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