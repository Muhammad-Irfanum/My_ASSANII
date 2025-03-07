const multer = require('multer');
const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');

// Ensure the "uploads" directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG, PNG, and JPG are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter }).single('image');

const uploadImage = (req, res) => {
  upload(req, res, function(err) {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    console.log('File uploaded:', req.file);
    const filePath = req.file.path;

    Tesseract.recognize(
      filePath,
      'eng',
      { logger: (m) => console.log(m) }
    ).then(({ data: { text } }) => {
      console.log('Extracted Text:', text);
      const cnicMatch = text.match(/\d{5}-\d{7}-\d{1}/);

      if (cnicMatch) {
        return res.json({ success: true, cnic: cnicMatch[0] });
      } else {
        return res.json({ success: false, message: 'CNIC not found' });
      }
    }).catch(error => {
      console.error('Error extracting CNIC:', error);
      res.status(500).json({ success: false, message: 'Error extracting CNIC' });
    });
  });
};

module.exports = {
  uploadImage
};
