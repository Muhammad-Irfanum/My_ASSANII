// src/components/ReviewModule/api/ReviewApi.js


// Mock data for development
const MOCK_REVIEWS = [
  {
    id: '1',
    serviceId: 'service1',
    userId: 'user1',
    user: {
      id: 'user1',
      name: 'Masood Khan',
      isVerified: true,
    },
    rating: 5,
    comment: 'Excellent service! Would definitely recommend to others.',
    date: 'Nov 12, 2022',
    helpfulCount: 8,
    notHelpfulCount: 1,
    isHelpfulByCurrentUser: false,
    isNotHelpfulByCurrentUser: false,
    isRecommended: true,
  },
  {
    id: '2',
    serviceId: 'service1',
    userId: 'user2',
    user: {
      id: 'user2',
      name: 'Irfan',
      isVerified: true,
    },
    rating: 4,
    comment: 'Great experience overall. Quick response and professional service.',
    date: 'Dec 5, 2022',
    helpfulCount: 5,
    notHelpfulCount: 0,
    isHelpfulByCurrentUser: false,
    isNotHelpfulByCurrentUser: false,
    isRecommended: true,
  },
  {
    id: '3',
    serviceId: 'service1',
    userId: 'user3',
    user: {
      id: 'user3',
      name: 'Sofia Amir',
      isVerified: true,
    },
    rating: 3,
    comment: 'Decent service but could be improved in some areas.',
    date: 'Jan 18, 2023 ',
    helpfulCount: 2,
    notHelpfulCount: 1,
    isHelpfulByCurrentUser: false,
    isNotHelpfulByCurrentUser: false,
    isRecommended: false,
  },
  {
    id: '4',
    serviceId: 'service2',
    userId: 'user4',
    user: {
      id: 'user4',
      name: 'Ahmed Khan',
      isVerified: true,
    },
    rating: 5,
    comment: 'Outstanding service! Everything was perfect from start to finish.',
    date: 'Feb 22, 2023',
    helpfulCount: 12,
    notHelpfulCount: 0,
    isHelpfulByCurrentUser: false,
    isNotHelpfulByCurrentUser: false,
    isRecommended: true,
  },
  {
    id: '5',
    serviceId: 'service2',
    userId: 'user5',
    user: {
      id: 'user5',
      name: 'Fatima Ali',
      isVerified: false,
    },
    rating: 2,
    comment: 'Service was below expectations. Several issues need to be addressed.',
    date: 'Mar 15, 2023',
    helpfulCount: 3,
    notHelpfulCount: 1,
    isHelpfulByCurrentUser: false,
    isNotHelpfulByCurrentUser: false,
    isRecommended: false,
  },
];

// Store submitted reviews in memory for the session
let submittedReviews = [];

export const reviewsApi = {
  getReviews: async (serviceId) => {
    try {
 
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Combine mock data with submitted reviews
      const allReviews = [...MOCK_REVIEWS, ...submittedReviews];
      
      // Filter reviews for the requested service
      const filteredReviews = serviceId 
        ? allReviews.filter(review => review.serviceId === serviceId)
        : allReviews;
        
   
      return filteredReviews;
    } catch (error) {
      console.error('API Error - getReviews:', error);
      throw new Error('Failed to fetch reviews');
    }
  },
  
  submitReview: async (reviewData) => {
    try {
      console.log('API: Submitting review:', reviewData);
      
      // Validate required fields
      if (!reviewData.serviceId) {
        throw new Error('Service ID is required');
      }
      
      if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
        throw new Error('Valid rating (1-5) is required');
      }
      
      if (!reviewData.comment || reviewData.comment.trim().length < 5) {
        throw new Error('Review comment with at least 5 characters is required');
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create a default user object to avoid null references
      const defaultUser = {
        id: 'guest-' + Date.now(),
        name: reviewData.anonymous ? 'Anonymous User' : 'Guest User',
        isVerified: false,
        avatar: null
      };
  
      // Use the provided user data or default to guest
      // Log both the reviewData.user and defaultUser to debug
      console.log('Review user data:', reviewData.user);
      console.log('Default user data:', defaultUser);
      
      const user = reviewData.user || defaultUser;
      console.log('Final user data used:', user);
  
      // Create new review object
      const newReview = {
        id: `review-${Date.now()}`,
        serviceId: reviewData.serviceId,
        userId: user.id,
        user: {
          id: user.id,
          name: reviewData.anonymous ? 'Anonymous User' : user.name,
          isVerified: !reviewData.anonymous && !!user.isVerified,
          avatar: reviewData.anonymous ? null : (user.avatar || null)
        },
        rating: reviewData.rating,
        comment: reviewData.comment,
        date: new Date().toLocaleDateString(),
        helpfulCount: 0,
        notHelpfulCount: 0,
        isHelpfulByCurrentUser: false,
        isNotHelpfulByCurrentUser: false,
        isRecommended: reviewData.rating >= 4,
        anonymous: !!reviewData.anonymous
      };
      
      // Add to our in-memory store
      submittedReviews.push(newReview);
      console.log('API: Submitted review:', newReview);
      
      return newReview;
    } catch (error) {
      console.error('API Error - submitReview:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  },
  
  markReviewHelpful: async (reviewId) => {
    try {
     
      if (!reviewId) {
        throw new Error('Review ID is required');
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return { reviewId, success: true };
    } catch (error) {
      console.error('API Error - markReviewHelpful:', error);
      throw new Error('Failed to mark review as helpful');
    }
  },
  
  markReviewNotHelpful: async (reviewId) => {
    try {
    
      
      if (!reviewId) {
        throw new Error('Review ID is required');
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return { reviewId, success: true };
    } catch (error) {
      console.error('API Error - markReviewNotHelpful:', error);
      throw new Error('Failed to mark review as not helpful');
    }
  },
  
  // Additional utility method to clear submitted reviews (for testing)
  clearSubmittedReviews: () => {
    submittedReviews = [];
    console.log('API: Cleared all submitted reviews');
    return { success: true };
  },
  
  // Get a specific review by ID
  getReviewById: async (reviewId) => {
    try {
    
      
      if (!reviewId) {
        throw new Error('Review ID is required');
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Search in both mock and submitted reviews
      const allReviews = [...MOCK_REVIEWS, ...submittedReviews];
      const review = allReviews.find(r => r.id === reviewId);
      
      if (!review) {
        throw new Error('Review not found');
      }
      
      console.log('API: Found review:', review);
      return review;
    } catch (error) {
      console.error('API Error - getReviewById:', error);
      throw error;
    }
  }
};

// Export the mock data for testing purposes
export const mockReviews = MOCK_REVIEWS;