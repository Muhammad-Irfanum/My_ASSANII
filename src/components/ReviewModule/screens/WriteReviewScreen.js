// src/components/ReviewModule/screens/WriteReviewScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSubmitReview } from '../hooks/useReviews';

const WriteReviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { serviceId, serviceName } = route.params || {};
  
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const { submitReview, isLoading } = useSubmitReview();
  
  const handleRatingPress = (selectedRating) => {
    setRating(selectedRating);
  };
  
  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting');
      return;
    }
    
    if (review.trim().length < 5) {
      Alert.alert('Review Required', 'Please write a review before submitting');
      return;
    }
    
    navigation.navigate('ReviewPreview', {
      rating,
      review,
      serviceId,
      serviceName,
    });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.ratingContainer}>
            <Text style={styles.label}>Score:</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleRatingPress(star)}
                  style={styles.starButton}
                >
                  <Ionicons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={32}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.reviewContainer}>
            <Text style={styles.label}>Review:</Text>
            <TextInput
              style={styles.reviewInput}
              multiline
              placeholder="Share your experience with this service..."
              value={review}
              onChangeText={setReview}
              maxLength={500}
            />
          </View>
          
          <TouchableOpacity
            style={[styles.submitButton, (rating === 0 || isLoading) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={rating === 0 || isLoading}
          >
            <Text style={styles.submitButtonText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1BBFB8',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  ratingContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starButton: {
    padding: 8,
  },
  reviewContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  reviewInput: {
    height: 120,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#1BBFB8',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default WriteReviewScreen;