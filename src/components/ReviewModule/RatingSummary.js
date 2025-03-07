// src/components/ReviewModule/components/RatingSummary.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RatingSummary = ({
  averageRating,
  ratingCounts,
  totalReviews,
}) => {
  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={`star-${star}`}
            name={star <= rating ? 'star' : 'star-outline'}
            size={16}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  const renderRatingBar = (rating) => {
    const count = ratingCounts[rating] || 0;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    
    return (
      <View style={styles.ratingBarContainer}>
        <Text style={styles.ratingNumber}>{rating}</Text>
        <View style={styles.barContainer}>
          <View style={[styles.bar, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.ratingCount}>{count}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.overallRating}>
        <Text style={styles.ratingValue}>{averageRating.toFixed(1)}</Text>
        {renderStars(Math.round(averageRating))}
        <Text style={styles.reviewsCount}>{totalReviews} Reviews</Text>
      </View>
      
      <View style={styles.ratingBars}>
        {[5, 4, 3, 2, 1].map((rating) => (
          <React.Fragment key={`rating-Bar-${rating}`}>
            {renderRatingBar(rating)}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overallRating: {
    alignItems: 'center',
    flex: 1,
  },
  ratingValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1BBFB8',
  },
  starsContainer: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  reviewsCount: {
    fontSize: 12,
    color: '#666',
  },
  ratingBars: {
    flex: 2,
  },
  ratingBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  ratingNumber: {
    width: 16,
    fontSize: 12,
    color: '#666',
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  bar: {
    height: 8,
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  ratingCount: {
    width: 24,
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
});

export default RatingSummary;