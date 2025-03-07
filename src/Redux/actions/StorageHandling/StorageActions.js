import storage from '@react-native-firebase/storage';
import { UPLOAD_START, UPLOAD_SUCCESS, UPLOAD_FAIL, UPLOAD_END } from './StorageTypes';

// Action creators
const uploadStart = () => {
  console.log('Upload started');
  return {
    type: UPLOAD_START,
  };
};

const uploadSuccess = (downloadUrl) => {
  console.log('Upload success:', downloadUrl);
  return {
    type: UPLOAD_SUCCESS,
    payload: downloadUrl, // Contains the download URL after successful upload
  };
};

const uploadFail = (errorMessage) => {
  console.log('Upload failed:', errorMessage);
  return {
    type: UPLOAD_FAIL,
    payload: errorMessage, // Contains the error message in case of failure
  };
};

const uploadEnd = () => {
  console.log('Upload ended');
  return {
    type: UPLOAD_END, // Ends the loading state
  };
};

// Function to upload a file to Firebase Storage
export const uploadFile = (fileUri, folderName) => async (dispatch) => {
  try {
    // Dispatch the start of the upload
    dispatch(uploadStart());

    console.log("Uploading file", fileUri, folderName);

    // Generate a unique file name
    const uniqueFileName = `${folderName}/${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`;
    const fileRef = storage().ref(uniqueFileName);

    // Upload the file from the URI
    await fileRef.putFile(fileUri);

    // Get the download URL of the uploaded file
    const downloadUrl = await fileRef.getDownloadURL();

    console.log("File uploaded successfully. Download URL:", downloadUrl);

    // Dispatch the success action with the download URL
    dispatch(uploadSuccess(downloadUrl));

    return downloadUrl; // Return download URL for further use
  } catch (error) {
    console.error('File upload failed:', error);

    // Dispatch the fail action with error message
    dispatch(uploadFail(error.message));

    throw error; // Rethrow error to be handled by the caller
  } finally {
    // End loading state
    dispatch(uploadEnd());
  }
};

// Function to update an existing file
export const updateFile = (oldFileName, newFileUri, folderName) => async (dispatch) => {
  try {
    // Dispatch the start of the update
    dispatch(uploadStart());

    console.log("Updating file", oldFileName, newFileUri, folderName);

    // Delete the old file first
    const oldFileRef = storage().ref(oldFileName);
    await oldFileRef.delete();
    console.log("Old file deleted successfully.");

    // Generate a unique name for the new file
    const uniqueFileName = `${folderName}/${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`;
    const newFileRef = storage().ref(uniqueFileName);

    // Upload the new file
    await newFileRef.putFile(newFileUri);

    // Get the download URL of the new uploaded file
    const downloadUrl = await newFileRef.getDownloadURL();

    console.log("New file uploaded successfully. Download URL:", downloadUrl);

    // Dispatch the success action with the download URL
    dispatch(uploadSuccess(downloadUrl));

    return downloadUrl; // Return download URL for further use
  } catch (error) {
    console.error('File update failed:', error);

    // Dispatch the fail action with error message
    dispatch(uploadFail(error.message));
  } finally {
    // End loading state
    dispatch(uploadEnd());
  }
};

// Function to delete a file
export const deleteFile = (fileName) => async (dispatch) => {
  try {
    // Dispatch the start of the deletion
    dispatch(uploadStart());

    console.log("Deleting file", fileName);

    // Get a reference to the file in Firebase Storage
    const fileRef = storage().ref(fileName);

    // Delete the file from Firebase Storage
    await fileRef.delete();

    console.log("File deleted successfully.");

    // Dispatch success action after file is deleted
    dispatch(uploadSuccess("File deleted successfully"));

  } catch (error) {
    console.error('File deletion failed:', error);

    // Dispatch the fail action with error message
    dispatch(uploadFail(error.message));
  } finally {
    // End loading state
    dispatch(uploadEnd());
  }
};
