import {
  FIRESTORE_LOADING,
  ADD_USER_SUCCESS,  // Add the success action
  ADD_USER_FAILURE,  // Add the failure action
} from '../actions/FirestoreHandling/FirestoreTypes';

const initialState = {
  loading: false,
  error: null,
  user: null,  // Track user data here
};

export const firestoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case FIRESTORE_LOADING:
      return {
        ...state,
        loading: action.payload,  // Set loading to true or false
      };
      

    case ADD_USER_SUCCESS:  // Handle success action
      return {
        ...state,
        user: action.payload,  // Store the user data
        loading: false,  // Stop loading on success
        error: null,  // Clear any previous errors
      };

    case ADD_USER_FAILURE:  // Handle failure action
      return {
        ...state,
        error: action.payload,  // Store the error message from failure
        loading: false,  // Stop loading on failure
      };

    default:
      return state;
  }
};
