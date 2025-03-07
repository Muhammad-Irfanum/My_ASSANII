// src/components/ReviewModule/redux/reviewsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewsApi } from '../api/ReviewApi';

const initialState = {
  reviews: [],
  isLoading: false,
  error: null,
};

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async ({ serviceId }, { rejectWithValue }) => {
    try {
     
      const reviews = await reviewsApi.getReviews(serviceId);
    
      return reviews;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return rejectWithValue(error.message || 'Failed to fetch reviews');
    }
  }
);

export const submitReviewAction = createAsyncThunk(
  'reviews/submitReview',
  async (reviewData, { rejectWithValue, getState}) => {
    try {
      console.log('Submitting review with data:', reviewData);

      //Get the aunthenication state
      const state = getState();
      const auth = state.auth || {};
      const user = auth.user || null;
      const isAuthenticated = !!auth.isAuthenticated;

      console.log('AUTH STATE in submit Review:', JSON.stringify(auth));
      console.log('USER in submit Review:', user ? JSON.stringify(user) : 'No user data');

      // If user data is not provided but user is authenticated, add it here
      if (!reviewData.user && isAuthenticated && user && !reviewData.anonymous) {
        reviewData.user = {
          id: user.id || user.uid || `user-${Date.now()}`,
          name: user.name || user.displayName || 'User',
          isVerified: true,
          avatar: user.avatar || user.photoURL || null
        };
        
        console.log('Added user data in thunk:', JSON.stringify(reviewData.user));
      }
      
      // Get the new review from the API
      const newReview = await reviewsApi.submitReview(reviewData);
      console.log('Submitted review:', newReview);
      
      return newReview;
    } catch (error) {
      console.error('Error submitting review:', error);
      return rejectWithValue(error.message || 'Failed to submit review');
    }
  }
);

export const markReviewHelpful = createAsyncThunk(
  'reviews/markHelpful',
  async (reviewId, { rejectWithValue }) => {
    try {
      return await reviewsApi.markReviewHelpful(reviewId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to mark review as helpful');
    }
  }
);

export const markReviewNotHelpful = createAsyncThunk(
  'reviews/markNotHelpful',
  async (reviewId, { rejectWithValue }) => {
    try {
      return await reviewsApi.markReviewNotHelpful(reviewId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to mark review as not helpful');
    }
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Reviews
      .addCase(fetchReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Submit Review
      .addCase(submitReviewAction.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload);
      })
      
      // Mark Review Helpful
      .addCase(markReviewHelpful.fulfilled, (state, action) => {
        const reviewIndex = state.reviews.findIndex(r => r.id === action.payload.reviewId);
        if (reviewIndex >= 0) {
          const review = state.reviews[reviewIndex];
          
          // If already marked as not helpful, decrement that count
          if (review.isNotHelpfulByCurrentUser) {
            review.notHelpfulCount = Math.max(0, review.notHelpfulCount - 1);
            review.isNotHelpfulByCurrentUser = false;
          }
          
          // Toggle helpful status
          if (review.isHelpfulByCurrentUser) {
            review.helpfulCount = Math.max(0, review.helpfulCount - 1);
            review.isHelpfulByCurrentUser = false;
          } else {
            review.helpfulCount += 1;
            review.isHelpfulByCurrentUser = true;
          }
        }
      })
      
      // Mark Review Not Helpful
      .addCase(markReviewNotHelpful.fulfilled, (state, action) => {
        const reviewIndex = state.reviews.findIndex(r => r.id === action.payload.reviewId);
        if (reviewIndex >= 0) {
          const review = state.reviews[reviewIndex];
          
          // If already marked as helpful, decrement that count
          if (review.isHelpfulByCurrentUser) {
            review.helpfulCount = Math.max(0, review.helpfulCount - 1);
            review.isHelpfulByCurrentUser = false;
          }
          
          // Toggle not helpful status
          if (review.isNotHelpfulByCurrentUser) {
            review.notHelpfulCount = Math.max(0, review.notHelpfulCount - 1);
            review.isNotHelpfulByCurrentUser = false;
          } else {
            review.notHelpfulCount += 1;
            review.isNotHelpfulByCurrentUser = true;
          }
        }
      });
  },
});

export default reviewsSlice.reducer;