var multer = require('multer');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(appRoot, 'public', 'files'));
	},
	filename: function (req, file, cb) {
		cb(null,  new Date().getTime() + '_' + file.originalname.normalize('NFC').replace(/ /g, '_'));
	}
});

var upload = multer({
	storage: storage
});