import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../reducers/authReducer';
import { firestoreReducer } from '../reducers/firestoreReducer';
import { storageReducer } from '../reducers/StorageReducer';
import { errorReducer } from '../reducers/errorReducer';

import reviewsReducer from '../../components/ReviewModule/redux/reviewsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    firestore: firestoreReducer,
    storage: storageReducer,
    error:errorReducer,
    reviews: reviewsReducer,
    
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // This helps with non-serializable data
    }),
});

export default store;
