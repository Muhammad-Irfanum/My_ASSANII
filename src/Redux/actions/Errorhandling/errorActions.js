// actions/ErrorHandling/errorActions.js
export const SET_ERROR = 'SET_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

// Action to set an error
export const setError = (error) => ({
  type: SET_ERROR,
  payload: {
    message: error.message || "An error occurred. Please try again.",
    code: error.code || "Error",
  },
});

// Action to clear an error
export const clearError = () => ({
  type: CLEAR_ERROR,
});
