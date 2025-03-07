import { SET_AUTH, LOGOUT, SET_LOADING } from '../actions/AuthHandling/authTypes';

const initialState = {
  isAuthenticated: false,
  user: null, // Add user property to hold user data
  loading: false, // Explicitly define loading state here
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload, // Save user data from action payload
        
      };

    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null, // Clear user data on logout
        
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload, // Expect a boolean value (true or false)
      };

    default:
      return state;
  }
};
