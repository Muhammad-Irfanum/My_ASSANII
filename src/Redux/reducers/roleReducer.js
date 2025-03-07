import { ROLES } from '../constants/roles';

const initialState = {
  role: null,
};

export const roleReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    default:
      return state;
  }
};
