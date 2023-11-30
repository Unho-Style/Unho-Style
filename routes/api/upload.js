var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs')
const appRoot = require('app-root-path').path;

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(appRoot, 'public', 'files'));
	},
	filename: function (req, file, cb) {
		cb(null,  new Date().getTime() + '_' + file.originalname.normalize('NFC').replace(/ /g, '_'));
	}
});

if(!fs.existsSync(path.join(appRoot, 'public', 'files'))) {
    fs.mkdirSync(path.join(appRoot, 'public', 'files'));
}



var upload = multer({
	storage: storage
});

router.post('/', function(req, res, next) {
	if(!!req.session.userId) {
		upload.single('upload')(req, res, (err) => {
            console.log(req)
			if(!req.file) {
				res.status(400);
				res.send({
					'status': res.statusCode,
                    error: {
                        'message': '파일이 누락되었습니다.',
                    }
				});
			}else if(err) {
                res.status(500);
                res.send({
                    status: res.statusCode,
                    error: {
                        message: '파일 업로드에 실패했습니다.',
                    }
                });
            }else{
                //console.log(req.upload.filename);
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