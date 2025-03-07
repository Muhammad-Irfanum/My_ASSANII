// src/components/ReviewModule/screens/ReviewsOverviewScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RatingSummary from '../RatingSummary';
import ReviewCard from '../ReviewCard';
import { useReviews } from '../hooks/useReviews';

const ReviewsOverviewScreen = ({ route }) => {
  const { serviceId = 'service1', serviceName = 'Default Service' } = route.params || {};
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  




  const { 
    reviews, 
    averageRating, 
    ratingCounts, 
    recommendedPercentage,
    isLoading,
    error,
    refreshReviews,
    markHelpful,
    markNotHelpful
  } = useReviews(serviceId);
  
  // Force a refresh when the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshReviews();
    });
    
    return unsubscribe;
  }, [navigation, refreshReviews]);
  
  const handleWriteReview = () => {
    navigation.navigate('WriteReview', { serviceId, serviceName });
  };
  
  const handleViewAllReviews = () => {
    navigation.navigate('ReviewsList', { serviceId, serviceName });
  };
  
  const handleHelpfulPress = (reviewId) => {
    markHelpful(reviewId);
  };
  
  const handleNotHelpfulPress = (reviewId) => {
    markNotHelpful(reviewId);
  };
  

  // Just show first 3 reviews
  const filteredReviews = reviews.slice(0, 3);
  
  if (isLoading && reviews.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading reviews...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Ratings & Reviews ({reviews.length})</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Summary</Text>
          
          <RatingSummary 
            averageRating={averageRating} 
            ratingCounts={ratingCounts} 
            totalReviews={reviews.length}
          />
          
          <View style={styles.recommendedContainer}>
            <Text style={styles.recommendedText}>{recommendedPercentage}%</Text>
            <Text style={styles.recommendedLabel}>Recommended </Text>
          </View>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Review"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
        
        <View style={styles.reviewThisContainer}>
          <Text style={styles.sectionTitle}>Review this product</Text>
          <TouchableOpacity 
            style={styles.writeReviewButton}
            onPress={handleWriteReview}
          >
            <Text style={styles.writeReviewText}>Write a Review</Text>
          </TouchableOpacity>
        </View>
        
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review}
              showRecommended
              onHelpfulPress={handleHelpfulPress}
              onNotHelpfulPress={handleNotHelpfulPress}
            />
          ))
        ) : (
          <View style={styles.noReviewsContainer}>
            <Ionicons name="chatbubble-ellipses-outline" size={48} color="#fff" />
            <Text style={styles.noReviewsText}>No reviews yet</Text>
            <Text style={styles.noReviewsSubtext}>Be the first to leave a review!</Text>
          </View>
        )}
        
        {reviews.length > 3 && (
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={handleViewAllReviews}
          >
            <Text style={styles.viewAllText}>View All Reviews</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#097573',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  recommendedContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  recommendedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1BBFB8',
  },
  recommendedLabel: {
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  reviewThisContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  writeReviewButton: {
    backgroundColor: '#80ED99',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  writeReviewText: {
    color: 'ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  viewAllButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    margin: 16,
  },
  viewAllText: {
    color: '#1BBFB8',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noReviewsContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 24,
    margin: 16,
  },
  noReviewsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  noReviewsSubtext: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ReviewsOverviewScreen;