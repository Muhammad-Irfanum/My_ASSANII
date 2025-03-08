// src/components/ReviewModule/components/ReviewCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReviewCard = ({
  review,
  showRecommended = false,
  onHelpfulPress,
  onNotHelpfulPress,
}) => {
  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={16}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.userName}>{review.user.name}</Text>
          {review.user.isVerified && (
            
            <Text style={styles.verifiedBadge}>Verified  </Text>
          )}
        </View>
        {renderStars(review.rating)}
      </View>
      
      
      <Text style={styles.reviewText}>{review.comment}</Text>
      
      <View style={styles.footer}>
        <View style={styles.helpfulContainer}>
          <Text style={styles.helpfulText}>Helpful?</Text>
          
          <TouchableOpacity 
            style={[
              styles.helpfulButton, 
              review.isHelpfulByCurrentUser && styles.helpfulButtonActive
            ]}
            onPress={() => review.id && onHelpfulPress && onHelpfulPress(review.id)}
          >
            <Text style={styles.helpfulButtonText}>Yes ({review.helpfulCount || 0})</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.helpfulButton, 
              review.isNotHelpfulByCurrentUser && styles.helpfulButtonActive
            ]}
            onPress={() => review.id && onNotHelpfulPress && onNotHelpfulPress(review.id)}
          >
            <Text style={styles.helpfulButtonText}>No ({review.notHelpfulCount || 0})</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.dateText}>{review.date}</Text>
      </View>
      
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  verifiedBadge: {
    fontSize: 12,
    color: '#666',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helpfulContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpfulText: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  helpfulButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  helpfulButtonActive: {
    backgroundColor: '#1BBFB8',
  },
  helpfulButtonText: {
    fontSize: 12,
    color: '#666',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  recommendedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  recommendedText: {
    fontSize: 12,
    color: '#1BBFB8',
    marginLeft: 4,
  },
});

export default ReviewCard;