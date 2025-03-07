const axios = require('axios');

exports.extractCnicText = async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image Base64 is required' });
    }

    // Google Vision API Endpoint
    const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`;


    // Create payload
    const payload = {
      "requests": [
        {
          "image": {
            "content": imageBase64
          },
          "features": [
            {
              "type": "DOCUMENT_TEXT_DETECTION"
            }
          ]
        }
      ]
    };

    // Send request to Google Vision API
    const response = await axios.post(endpoint, payload);
    
    // Extract text from response
    const fullTextAnnotation = response.data.responses[0]?.fullTextAnnotation;

    if (fullTextAnnotation) {
      // Use regex to find CNIC format
      const cnicRegex = /\b\d{5}-\d{7}-\d{1}\b/;
      const cnicMatch = fullTextAnnotation.text.match(cnicRegex);
      
      if (cnicMatch) {
        // Remove hyphens from the CNIC
        const cnicWithoutHyphens = cnicMatch[0].replace(/-/g, '');
        console.log('CNIC:', cnicWithoutHyphens);
        return res.status(200).json({
          success: true,
          cnic: cnicWithoutHyphens,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'No valid CNIC detected in the image',
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: 'No text detected in the image',
      });
    }
  } catch (error) {
    console.error('Error during text detection:', error.message);
    return res.status(500).json({ error: 'Failed to extract text' });
  }
};


exports.extractVerificationText = async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image Base64 is required' });
    }

    // Google Vision API Endpoint
    const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`;


    // Create payload
    const payload = {
      "requests": [
        {
          "image": {
            "content": imageBase64
          },
          "features": [
            {
              "type": "DOCUMENT_TEXT_DETECTION"
            }
          ]
        }
      ]
    };

    // Send request to Google Vision API
    const response = await axios.post(endpoint, payload);
    
    // Extract text from response
    const fullTextAnnotation = response.data.responses[0]?.fullTextAnnotation;

    if (fullTextAnnotation) {
      // Use regex to find 5-digit verification code
      const verificationRegex = /\b\d{6}\b/;
      const verificationMatch = fullTextAnnotation.text.match(verificationRegex);
      
      if (verificationMatch) {
        console.log('Verification Code:', verificationMatch[0]);
        return res.status(200).json({
          success: true,
          verificationCode: verificationMatch[0],
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'No valid verification code detected in the image',
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: 'No text detected in the image',
      });
    }
  } catch (error) {
    console.error('Error during text detection:', error.message);
    return res.status(500).json({ error: 'Failed to extract text' });
  }
};