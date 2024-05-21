const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Setting destination...');
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + path.extname(file.originalname);
    console.log('Saving file with name:', filename);
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

const uploadMiddleware = upload.single('image');

module.exports = (req, res, next) => {
  uploadMiddleware(req, res, function (err) {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(400).send('File upload failed.');
    }
    console.log('File upload successful:', req.file);
    next();
  });
};
