const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/extractcnicController.js');  // Import controller function
router.post('/upload', uploadImage);

module.exports = router;
