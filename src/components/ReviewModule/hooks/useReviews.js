// src/components/ReviewModule/hooks/useReviews.js
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchReviews, 
  submitReviewAction, 
  markReviewHelpful,
  markReviewNotHelpful
} from '../redux/reviewsSlice';

export const useReviews = (serviceId) => {
  const dispatch = useDispatch();
  const { reviews, isLoading, error } = useSelector((state) => state.reviews);
  
  const loadReviews = useCallback(() => {
    if (serviceId) {
      dispatch(fetchReviews({ serviceId }));
    }
  }, [dispatch, serviceId]);
  
  useEffect(() => {
    loadReviews();
  }, [loadReviews]);
  
  // Filter reviews for this service
  const serviceReviews = reviews.filter(review => review.serviceId === serviceId);
  
  // Calculate average rating
  const averageRating = serviceReviews.length > 0
    ? serviceReviews.reduce((sum, review) => sum + review.rating, 0) / serviceReviews.length
    : 0;
  
  // Calculate rating counts
  const ratingCounts = serviceReviews.reduce((counts, review) => {
    counts[review.rating] = (counts[review.rating] || 0) + 1;
    return counts;
  }, {});
  
  // Calculate recommended percentage
  const recommendedCount = serviceReviews.filter(review => review.rating >= 4).length;
  const recommendedPercentage = serviceReviews.length > 0
    ? Math.round((recommendedCount / serviceReviews.length) * 100)
    : 0;
  
  const markHelpful = async (reviewId) => {
    try {
      await dispatch(markReviewHelpful(reviewId));
    } catch (error) {
      console.error('Failed to mark review as helpful:', error);
    }
  };
  
  const markNotHelpful = async (reviewId) => {
    try {
      await dispatch(markReviewNotHelpful(reviewId));
    } catch (error) {
      console.error('Failed to mark review as not helpful:', error);
    }
  };
  
  return {
    reviews: serviceReviews,
    isLoading,
    error,
    refreshReviews: loadReviews,
    averageRating,
    ratingCounts,
    recommendedPercentage,
    markHelpful,
    markNotHelpful,
  };
};


export const useSubmitReview = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const submitReview = async (reviewData) => {
    try {
      console.log('Starting review submission with data:', reviewData);
      setIsLoading(true);
      setError(null);
      
      // Validate data
      if (!reviewData.serviceId) {
        console.error('Missing serviceId in review data');
        throw new Error('Service ID is required');
      }
      
      if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
        console.error('Invalid rating in review data:', reviewData.rating);
        throw new Error('Valid rating is required');
      }
      
      if (!reviewData.comment || reviewData.comment.trim().length < 5) {
        console.error('Invalid comment in review data:', reviewData.comment);
        throw new Error('Review comment is required');
      }
      
      // Dispatch the action
      const result = await dispatch(submitReviewAction(reviewData)).unwrap();
      console.log('Review submission successful:', result);
      return true;
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.message || 'Failed to submit review');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    submitReview,
    isLoading,
    error,
  };
};