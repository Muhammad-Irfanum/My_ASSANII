const express = require('express');
const { extractCnicText } = require('../controllers/extractcnicgoogle'); // Import controller
const { extractVerificationText } = require('../controllers/extractcnicgoogle'); // Import controller
const router = express.Router();

// Define a POST route for text extraction
router.post('/cnic/extract', extractCnicText);
router.post('/verification/extract', extractVerificationText);


module.exports = router; // Export the router
