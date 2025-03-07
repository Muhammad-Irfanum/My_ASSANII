import { UPLOAD_START, UPLOAD_SUCCESS, UPLOAD_FAIL, UPLOAD_END } from '../actions/StorageHandling/StorageTypes';

const initialState = {
  loading: false,  // Track loading state
  error: null,     // Track errors during the upload process
  downloadUrl: null, // Store the download URL after successful upload
};

export const storageReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_START:
      return {
        ...state,
        loading: true,   // Set loading to true when upload starts
        error: null,     // Reset error when upload starts
        downloadUrl: null, // Reset download URL before uploading a new file
      };
    case UPLOAD_SUCCESS:
      return {
        ...state,
        loading: false,  // Set loading to false when upload is complete
        error: null,     // Reset error if upload succeeds
        downloadUrl: action.payload,  // Store the successful download URL
      };
    case UPLOAD_FAIL:
      return {
        ...state,
        loading: false,  // Set loading to false if upload fails
        error: action.payload,  // Store the error message
        downloadUrl: null, // Reset download URL if upload fails
      };
    case UPLOAD_END:
      return {
        ...state,
        loading: false,  // Reset loading state when the upload process ends (success or failure)
      };
    default:
      return state;
  }
};
