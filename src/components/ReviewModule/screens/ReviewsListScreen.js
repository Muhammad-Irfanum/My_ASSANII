// src/components/ReviewModule/screens/ReviewsListScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ReviewCard from '../ReviewCard';
import { useReviews } from '../hooks/useReviews';

const ReviewsListScreen = () => {
  const route = useRoute();
  const { serviceId, serviceName } = route.params || {};
  
  const [activeFilter, setActiveFilter] = useState('all');
  const { 
    reviews, 
    isLoading, 
    error, 
    refreshReviews, 
    markHelpful, 
    markNotHelpful 
  } = useReviews(serviceId);
  
  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: '5', label: '5 Stars' },
    { id: '4', label: '4 Stars' },
    { id: '3', label: '3 Stars' },
    { id: '2', label: '2 Stars' },
    { id: '1', label: '1 Star' },
  ];
  
  const filteredReviews = activeFilter === 'all' 
    ? reviews 
    : reviews.filter(review => review.rating === parseInt(activeFilter, 10));
  
  const handleHelpfulPress = (reviewId) => {
    markHelpful(reviewId);
  };
  
  const handleNotHelpfulPress = (reviewId) => {
    markNotHelpful(reviewId);
  };
  
  if (isLoading && reviews.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading reviews...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#fff" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshReviews}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filter Reviews</Text>
      </View>
      
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                activeFilter === filter.id && styles.activeFilterButton,
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter.id && styles.activeFilterText,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredReviews}
        keyExtractor={(item) => item.id || item.date}
        renderItem={({ item }) => (
          <ReviewCard
            review={item}
            onHelpfulPress={handleHelpfulPress}
            onNotHelpfulPress={handleNotHelpfulPress}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={refreshReviews}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-ellipses-outline" size={48} color="#fff" />
            <Text style={styles.emptyText}>No reviews found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1BBFB8',
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#fff',
  },
  filterText: {
    color: '#fff',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#1BBFB8',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1BBFB8',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1BBFB8',
    padding: 24,
  },
  errorText: {
    color: '#fff',
    marginTop: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 16,
  },
  retryText: {
    color: '#1BBFB8',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
  },
});

export default ReviewsListScreen;