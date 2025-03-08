"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import RatingSummary from "../RatingSummary"
import ReviewCard from "../ReviewCard"
import { useReviews } from "../hooks/useReviews"

const ReviewsOverviewScreen = ({ route }) => {
  const { serviceId = "service1", serviceName = "Default Service" } = route.params || {}
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

  const {
    reviews,
    averageRating,
    ratingCounts,
    recommendedPercentage,
    isLoading,
    error,
    refreshReviews,
    markHelpful,
    markNotHelpful,
  } = useReviews(serviceId)

  // Force a refresh when the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refreshReviews()
    })

    return unsubscribe
  }, [navigation, refreshReviews])

  //add write review button
  const handleWriteReview = () => {
    navigation.navigate("WriteReview", { serviceId, serviceName })
  }

  const handleViewAllReviews = () => {
    navigation.navigate("ReviewsList", { serviceId, serviceName })
  }

  const handleHelpfulPress = (reviewId) => {
    markHelpful(reviewId)
  }

  const handleNotHelpfulPress = (reviewId) => {
    markNotHelpful(reviewId)
  }

  // Filter reviews based on rating
  const getFilteredReviews = () => {
    let filtered = [...reviews]

    if (activeFilter !== "all") {
      const ratingFilter = Number.parseInt(activeFilter, 10)
      filtered = filtered.filter((review) => review.rating === ratingFilter)
    }

    // Apply search filter if there's a search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (review) => review.comment.toLowerCase().includes(query) || review.user.name.toLowerCase().includes(query),
      )
    }

    return filtered.slice(0, 3) // Just show first 3 reviews
  }

  const filteredReviews = getFilteredReviews()

  if (isLoading && reviews.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading reviews...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Ratings & Reviews ({reviews.length})</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Summary</Text>

          <RatingSummary averageRating={averageRating} ratingCounts={ratingCounts} totalReviews={reviews.length} />

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

        //add write review button
        <TouchableOpacity style={styles.viewAllButton} onPress={handleWriteReview}>
          <Text style={styles.viewAllText}>Write a Review</Text>  
        </TouchableOpacity>

        {/* Filter Section */}
        <View style={styles.filterContainer}>
          <Text style={styles.sectionTitle}>Filter Reviews</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity
              style={[styles.filterButton, activeFilter === "all" && styles.activeFilterButton]}
              onPress={() => setActiveFilter("all")}
            >
              <Text style={[styles.filterText, activeFilter === "all" && styles.activeFilterText]}>All</Text>
            </TouchableOpacity>
            {[5, 4, 3, 2, 1].map((rating) => (
              <TouchableOpacity
                key={rating}
                style={[styles.filterButton, activeFilter === rating.toString() && styles.activeFilterButton]}
                onPress={() => setActiveFilter(rating.toString())}
              >
                <Text style={[styles.filterText, activeFilter === rating.toString() && styles.activeFilterText]}>
                  {rating} {rating === 1 ? "Star" : "Stars"}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
            <Text style={styles.noReviewsText}>No reviews found</Text>
            <Text style={styles.noReviewsSubtext}>Try adjusting your filters</Text>
          </View>
        )}

        {reviews.length > 3 && (
          <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAllReviews}>
            <Text style={styles.viewAllText}>View All Reviews</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#097573",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  summaryCard: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 12,
    margin: 16,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  recommendedContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  recommendedText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1BBFB8",
  },
  recommendedLabel: {
    fontSize: 14,
    color: "#666",
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
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
  filterContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  filterScroll: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  filterButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilterButton: {
    backgroundColor: "#1BBFB8",
  },
  filterText: {
    color: "#fff",
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#fff",
    fontWeight: "bold",
  },
  viewAllButton: {
    width: "50%",
    alignSelf: "center",
    backgroundColor: "#1BBFB8",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    margin: 16,
    fontWeight: "bold",
  },
  viewAllText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  noReviewsContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 24,
    margin: 16,
  },
  noReviewsText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
  },
  noReviewsSubtext: {
    color: "#fff",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
})

export default ReviewsOverviewScreen

