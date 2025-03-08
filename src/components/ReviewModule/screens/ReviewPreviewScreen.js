// src/components/ReviewModule/screens/ReviewPreviewScreen.js
import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { submitReviewAction } from '../redux/reviewsSlice';

const ReviewPreviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  // Get the current user from your auth state with more detailed logging
  const auth = useSelector((state) => state.auth || {});
  const user = auth.user || null;
  const isAuthenticated = !!auth.isAuthenticated;

  // Log auth state when component loads
  useEffect(() => {
    console.log('AUTH STATE:', JSON.stringify(auth));
    console.log('USER:', user ? JSON.stringify(user) : 'No user data ');
    console.log('IS AUTHENTICATED:', isAuthenticated);
  }, [auth, user, isAuthenticated]);

  // Get params from route
  const { rating = 0, review = '', serviceId = '', serviceName = '' } = route.params || {};
  
  // State for submission and anonymous option
  const [submitting, setSubmitting] = React.useState(false);
  const [anonymous, setAnonymous] = React.useState(false);
  
  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={`star-${star}`}
            name={star <= rating ? 'star' : 'star-outline'}
            size={24}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };
  
  const handleEdit = () => {
    navigation.goBack();
  };
  
  // Determine the display name for the review preview
  const getDisplayName = () => {
    if (anonymous) {
      return 'Anonymous User';
    }
    
    if (isAuthenticated && user) {
      return user.fullname || user.displayName || 'User';
    }
    
    return 'Guest User';
  };
  
  const displayName = getDisplayName();
  
  const handleSubmit = async () => {
    if (submitting) return; // Prevent multiple submissions
    
    try {
      setSubmitting(true);
      
      // Validate data
      if (!serviceId) {
        throw new Error('Service ID is missing');
      }
      
      if (!rating || rating < 1 || rating > 5) {
        throw new Error('Please provide a valid rating');
      }
      
      if (!review || review.trim().length < 5) {
        throw new Error('Please provide a review with at least 5 characters');
      }
      
      // Create review data
      const reviewData = {
        serviceId,
        rating,
        comment: review,
        anonymous
      };
      
      // Log auth state just before creating user data
      console.log('AUTH STATE PRE-SUBMISSION:', JSON.stringify(auth));
      console.log('USER PRE-SUBMISSION:', user ? JSON.stringify(user) : 'No user data ');
      
      // Add user data if authenticated and not anonymous
      if (isAuthenticated && user && !anonymous) {
        // Make sure to include all user fields
        reviewData.user = {
          id: user.id || user.uid || "user-" + Date.now(),
          name: user.fullname || user.name || user.displayName || "User",
          isVerified: !!user.isverified,
          avatar: user.profileImage || user.avatar || user.photoURL || null,
        };
        
        // Log the user object we're sending
        console.log('USER DATA BEING SENT:', JSON.stringify(reviewData.user));
      } else {
        console.log('NOT ADDING USER DATA. Auth status:', isAuthenticated, 'Anonymous:', anonymous, 'User exists:', !!user);
      }
      
      console.log('FINAL REVIEW DATA:', JSON.stringify(reviewData));
      
      // Dispatch the action
      await dispatch(submitReviewAction(reviewData));

      Alert.alert("Review Posted", "Your review has been posted successfully!", [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("ReviewsOverview", {
              serviceId,
              serviceName,
              refresh: Date.now(),
            })
          },
        },
      ]);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      Alert.alert("Error", error.message || "Failed to post review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.previewCard}>
          <Text style={styles.label}>Score:</Text>
          {renderStars(rating)}
          
          <View style={styles.reviewContainer}>
            <Text style={styles.reviewText}>{review}</Text>
          </View>
          
          <View style={styles.userReviewContainer}>
            <View style={styles.userInfoRow}>
              <Text style={styles.userReviewTitle}>Review by: </Text>
              <Text style={styles.userName}>{displayName}</Text>
              {isAuthenticated && user && !anonymous && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#1BBFB8" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
            <Text style={styles.userReviewText}>{review}</Text>
          </View>
          
          {/* Anonymous review option */}
          {isAuthenticated && user && (
            <View style={styles.anonymousContainer}>
              <Text style={styles.anonymousLabel}>Post anonymously</Text>
              <Switch
                value={anonymous}
                onValueChange={setAnonymous}
                trackColor={{ false: '#d9d9d9', true: '#1BBFB8' }}
                thumbColor={anonymous ? '#fff' : '#f4f3f4'}
              />
            </View>
          )}
        </View>
        
        <TouchableOpacity
          style={[styles.postButton, submitting && styles.postButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.postButtonText}>{submitting ? "Posting..." : "Post"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.editButton} onPress={handleEdit} disabled={submitting}>
          <Text style={styles.editButtonText}>Edit Review</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1BBFB8',
  },
  scrollContent: {
    padding: 16,
  },
  previewCard: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  reviewContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  reviewText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userReviewContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  userReviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    color: '#0066CC',
    fontWeight: 'bold',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9f8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  verifiedText: {
    fontSize: 12,
    color: '#1BBFB8',
    marginLeft: 2,
  },
  userReviewText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  anonymousContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  anonymousLabel: {
    fontSize: 16,
    color: '#333',
  },
  postButton: {
    width: '50%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  postButtonDisabled: {
    opacity: 0.7,
  },
  postButtonText: {
    color: '#1BBFB8',
    fontWeight: 'bold',
    fontSize: 16,
  },
  editButton: {
    width: '50%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  editButtonText: {
    color: '#1bbfb8',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ReviewPreviewScreen;