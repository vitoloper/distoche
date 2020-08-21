const multer = require('multer');
const path = require('path');
const uploadConfig = require('../config/uploads.config');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
})

// Field name in form-data must be 'photo' (value is the encoded file)
var multerUpload = multer({ storage: storage }).single('photo');

exports.getOne = (req, res) => {
  var filename = req.params.filename;

  if (!filename) {
    return res.status(400).json({ message: 'Image filename required' });
  }

  // Send file
  res.sendFile(path.join(__dirname, '../..', uploadConfig.DIR, filename));
}

exports.upload = (req, res) => {
  multerUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(500).json({ message: 'Multer error' , error: err});
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).json({ message: 'Unknown upload error' , error: err});
    }

    // console.log(req.file);
    res.status(200).json(req.file);
  });
}
