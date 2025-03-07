import firestore from '@react-native-firebase/firestore';
import { setError, clearError } from "../Errorhandling/errorActions"; // Import the setError and clearError actions
import {
  FIRESTORE_LOADING,
  ADD_USER_SUCCESS,
  ADD_USER_FAILURE,
} from './FirestoreTypes';
import { setAuth } from '../AuthHandling/authActions';

// Set loading state
export const setLoading = (loading) => ({
  type: FIRESTORE_LOADING,
  payload: loading,
});

// Add user success action
export const addUserSuccess = (user) => ({
  type: ADD_USER_SUCCESS,
  payload: user,
});

// Add user failure action
export const addUserFailure = (error) => ({
  type: ADD_USER_FAILURE,
  payload: error,
});

// Function to add a user to Firestore
export const addUser = (user) => async (dispatch) => {
  dispatch(setLoading(true));  // Start loading

  try {
    console.log('Adding user to Firestore:', user);
    await firestore().collection('users').doc(user.uid).set(user);

    dispatch(addUserSuccess(user));  // Dispatch success action
    dispatch(clearError());  // Clear any previous errors

    // Return success response to the component
    return { success: true, message: 'User added successfully!' };  
  } catch (error) {
    console.error('Error adding user:', error);

    // Handle different error types
    let errorMessage = 'Failed to add user. Please try again.';
    
    if (error.code) {
      switch (error.code) {
        case 'unavailable':
          errorMessage = 'Firestore is currently unavailable. Please try again later.';
          break;
        case 'permission-denied':
          errorMessage = 'You do not have permission to add users.';
          break;
        default:
          errorMessage = error.message || 'An unexpected error occurred while adding user.';
      }
    } else {
      errorMessage = error.message || 'An unexpected error occurred.';
    }

    // Dispatch error to the error reducer
    dispatch(setError({ code: error.code, message: errorMessage }));

    // Return failure response to the component
    return { success: false, message: errorMessage };
  } finally {
    dispatch(setLoading(false));  // Stop loading after process
  }
};

// Function to edit a user in Firestore
export const editUser = (user) => async (dispatch) => {
  dispatch(setLoading(true));  // Start loading

  try {
    console.log('Editing user in Firestore:', user);

    // Update the user document in Firestore
    await firestore().collection('users').doc(user.uid).update(user);

    const updatedUserSnapshot = await firestore().collection('users').doc(user.uid).get();
    const updatedUserData = updatedUserSnapshot.data();
    console.log('Updated user data:', updatedUserData);

    dispatch(setAuth(updatedUserData));  // Update the auth state with the new user data
    dispatch(addUserSuccess(user));  // Dispatch success action
    dispatch(clearError());  // Clear any previous errors

    // Return success response to the component
    return { success: true, message: 'User updated successfully!' };  
  } catch (error) {
    console.error('Error updating user:', error);

    // Handle different error types
    let errorMessage = 'Failed to update user. Please try again.';
    
    if (error.code) {
      switch (error.code) {
        case 'unavailable':
          errorMessage = 'Firestore is currently unavailable. Please try again later.';
          break;
        case 'permission-denied':
          errorMessage = 'You do not have permission to update user data.';
          break;
        default:
          errorMessage = error.message || 'An unexpected error occurred while updating user.';
      }
    } else {
      errorMessage = error.message || 'An unexpected error occurred.';
    }

    // Dispatch error to the error reducer
    dispatch(setError({ code: error.code, message: errorMessage }));

    // Return failure response to the component
    return { success: false, message: errorMessage };
  } finally {
    dispatch(setLoading(false));  // Stop loading after process
  }
};
