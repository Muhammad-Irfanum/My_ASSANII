import axios from 'axios';
import * as FileSystem from 'expo-file-system';

// const URL='http://192.168.18.164:5000'

export const extractText = async (imageUri) => {
  try {
    console.log('Original Image URI:', imageUri);

    // Define a new file path in a supported directory
    const newPath = `${FileSystem.documentDirectory}uploaded_image.jpeg`;

    // Copy the file to the supported directory
    await FileSystem.copyAsync({
      from: imageUri,
      to: newPath,
    });

    console.log('File copied to:', newPath);

    // Read the Base64 content from the new path
    const base64Image = await FileSystem.readAsStringAsync(newPath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('Base64 Image:', base64Image.slice(0, 100)); // Log first 100 characters

    // Send the Base64 image to the backend
    const response = await axios.post('https://aasani.onrender.com/api/cnic/extract', {
      imageBase64: base64Image,
    });

    console.log('Extracted Text:', response.data.cnic);
    return response.data.cnic;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};


export const extractVerification = async (imageUri) => {
  try {
    console.log('Original Image URI:', imageUri);

    // Define a new file path in a supported directory
    const newPath = `${FileSystem.documentDirectory}uploaded_image.jpeg`;

    // Copy the file to the supported directory
    await FileSystem.copyAsync({
      from: imageUri,
      to: newPath,
    });

    console.log('File copied to:', newPath);

    // Read the Base64 content from the new path
    const base64Image = await FileSystem.readAsStringAsync(newPath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('Base64 Image:', base64Image.slice(0, 100)); // Log first 100 characters

    // Send the Base64 image to the backend
    const response = await axios.post('https://aasani.onrender.com/api/verification/extract', {
      imageBase64: base64Image,
    });

    console.log('Extracted Text:', response.data.verificationCode);
    return response.data.verificationCode;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};





//not used for now




// Extract CNIC from an image
export const ExtractCNIC = async (imageUri) => {
  console.log('Extracting CNIC from image:', imageUri);

  // Check if the imageUri is provided
  if (!imageUri) {
    console.error('No image URI provided');
    return 'No image selected!';
  }

  // Create a FormData object to send the image to the server
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri, // Use the correct URI format for React Native
    name: 'nic.jpg', // Name of the file
    type: 'image/jpeg', // Mime type for the image
  });

  try {
    // Make the API call using axios
    const response = await axios.post('http://192.168.18.33:5000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Tell the server it's a file upload
      },
    });

    // Assuming the server returns a CNIC in the response
    console.log('Extracted CNIC:', response.data);
    return response.data; // Or handle the response as needed

  } catch (error) {
    console.error('Error extracting CNIC:', error);
    return 'Error extracting CNIC'; // Return error message if the upload fails
  }
};

// Extract Verification Code from an image
export const ExtractVerificationCode = async (imageUri) => {
  console.log('Extracting Verification Code from image:', imageUri);

  // Check if the imageUri is provided
  if (!imageUri) {
    console.error('No image URI provided');
    return 'No image selected!';
  }

  // Create a FormData object to send the image to the server
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri, // Use the correct URI format for React Native
    name: 'verification.jpg', // Name of the file
    type: 'image/jpeg', // Mime type for the image
  });

  try {
    // Make the API call using axios
    const response = await axios.post('http://192.168.18.164:5000/extract-verification-code', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Tell the server it's a file upload
      },
    });

    // Assuming the server returns a verification code in the response
    console.log('Extracted Verification Code:', response.data);
    return response.data; // Or handle the response as needed

  } catch (error) {
    console.error('Error extracting verification code:', error);
    return 'Error extracting verification code'; // Return error message if the upload fails
  }
};
