import { SET_ERROR, CLEAR_ERROR } from "../actions/Errorhandling/errorActions";

const initialState = {
  success: false,
  errorMessage: null,
  errorCode: null,
};

export const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ERROR:
      return {
        ...state,
        success: false,
        errorCode: action.payload.code || "Error",
        errorMessage:
          action.payload.message || "An error occurred. Please try again.",
      };
    case CLEAR_ERROR:
      return {
        ...state,
        success: true,
        errorCode: null,
        errorMessage: null,
      };
    default:
      return state;
  }
};
