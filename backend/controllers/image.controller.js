const path = require('path');
const uploadConfig = require('../config/uploads.config');

exports.getOne = (req, res) => {
  var filename = req.params.filename;

  if (!filename) {
    return res.status(400).json({ message: 'Image filename required' });
  }

  // Send file
  res.sendFile(path.join(__dirname, '../..', uploadConfig.DIR, filename));
}
