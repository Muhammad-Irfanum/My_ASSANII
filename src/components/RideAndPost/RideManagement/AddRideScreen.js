// screens/AddRideScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Platform,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { useCitySearch } from "../../../Hooks/useCitySearch"; // Import the custom hook
import { LogBox } from "react-native";
LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

export default function AddRideScreen() {
  const [departureLocation, setDepartureLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [departureDate, setDepartureDate] = useState(new Date());
  const [departureTime, setDepartureTime] = useState(new Date());
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [rideDescription, setRideDescription] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [specificAddressInstructions, setSpecificAddressInstructions] = useState("");

  const navigation = useNavigation();

  // Use the custom hook for city search
  const {
    searchResults: departureSearchResults,
    isSearching: isSearchingDeparture,
    debouncedSearch: debouncedDepartureSearch,
  } = useCitySearch();

  const {
    searchResults: destinationSearchResults,
    isSearching: isSearchingDestination,
    debouncedSearch: debouncedDestinationSearch,
  } = useCitySearch();

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) setDepartureDate(selectedDate);
    setShowDatePicker(false);
  };

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) setDepartureTime(selectedTime);
    setShowTimePicker(false);
  };

  const handleSubmit = () => {
    if (!departureLocation.trim() || !destinationLocation.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    navigation.goBack();
  };

  const handleLocationSelect = (location, setLocation) => {
    setLocation(location.display_name);
  };

  const clearInput = (setLocation) => {
    setLocation("");
  };

  return (
    <LinearGradient colors={["#0AD1C8", "#073235"]} className="flex-1 px-6 py-6">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold ml-4">Add Ride</Text>
        </View>

        {/* Travel Details */}
        <View className="mb-6">
          <Text className="text-white text-lg font-bold mb-4 border-b border-white/30 pb-2">
            Travel Details
          </Text>

          {/* Departure Location */}
          <View className="mb-4">
            <Text className="text-white text-base mb-2">Departure Location</Text>
            <View className="flex-row items-center bg-white/20 rounded-lg overflow-hidden">
              <TextInput
                className="flex-1 py-3 px-4 text-white text-base"
                placeholder="Enter location"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={departureLocation}
                onChangeText={(text) => {
                  setDepartureLocation(text);
                  debouncedDepartureSearch(text); // Debounced search
                }}
              />
              {departureLocation.length > 0 && (
                <TouchableOpacity
                  className="p-3"
                  onPress={() => clearInput(setDepartureLocation)}
                >
                  <Ionicons name="close-circle" size={20} color="white" />
                </TouchableOpacity>
              )}
            </View>
            {isSearchingDeparture && <Text className="text-white mt-2">Searching...</Text>}
            <FlatList
              data={departureSearchResults}
              keyExtractor={(item) => item.place_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="bg-white/20 rounded-lg py-2 px-4 mt-2"
                  onPress={() => handleLocationSelect(item, setDepartureLocation)}
                >
                  <Text className="text-white">{item.display_name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Destination Location */}
          <View className="mb-4">
            <Text className="text-white text-base mb-2">Destination Location</Text>
            <View className="flex-row items-center bg-white/20 rounded-lg overflow-hidden">
              <TextInput
                className="flex-1 py-3 px-4 text-white text-base"
                placeholder="Enter destination address"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={destinationLocation}
                onChangeText={(text) => {
                  setDestinationLocation(text);
                  debouncedDestinationSearch(text); // Debounced search
                }}
              />
              {destinationLocation.length > 0 && (
                <TouchableOpacity
                  className="p-3"
                  onPress={() => clearInput(setDestinationLocation)}
                >
                  <Ionicons name="close-circle" size={20} color="white" />
                </TouchableOpacity>
              )}
            </View>
            {isSearchingDestination && <Text className="text-white mt-2">Searching...</Text>}
            <FlatList
              data={destinationSearchResults}
              keyExtractor={(item) => item.place_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="bg-white/20 rounded-lg py-2 px-4 mt-2"
                  onPress={() => handleLocationSelect(item, setDestinationLocation)}
                >
                  <Text className="text-white">{item.display_name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Specific Address Instructions */}
          <View className="mb-4">
            <Text className="text-white text-base mb-2">
              Specific Address Instructions (Optional)
            </Text>
            <TextInput
              className="bg-white/20 rounded-lg py-3 px-4 text-white text-base h-24"
              placeholder="e.g., Near the main gate, behind the mall..."
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              multiline
              value={specificAddressInstructions}
              onChangeText={setSpecificAddressInstructions}
            />
          </View>

          {/* Departure Date */}
          <View className="mb-4">
            <Text className="text-white text-base mb-2">Departure Date</Text>
            <TouchableOpacity
              className="bg-white/20 rounded-lg py-3 px-4 flex-row justify-between items-center"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className="text-white text-base">
                {departureDate.toLocaleDateString()}
              </Text>
              <Ionicons name="calendar" size={24} color="white" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={departureDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          {/* Departure Time */}
          <View className="mb-4">
            <Text className="text-white text-base mb-2">Departure Time</Text>
            <TouchableOpacity
              className="bg-white/20 rounded-lg py-3 px-4 flex-row justify-between items-center"
              onPress={() => setShowTimePicker(true)}
            >
              <Text className="text-white text-base">
                {departureTime.toLocaleTimeString()}
              </Text>
              <Ionicons name="time" size={24} color="white" />
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={departureTime}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>
        </View>

        {/* Ride Details */}
        <View className="mb-6">
          <Text className="text-white text-lg font-bold mb-4 border-b border-white/30 pb-2">
            Ride Details
          </Text>

          {/* Special Instructions */}
          <View className="mb-4">
            <Text className="text-white text-base mb-2">
              Special Instructions (Optional)
            </Text>
            <TextInput
              className="bg-white/20 rounded-lg py-3 px-4 text-white text-base h-24"
              placeholder="e.g., Only accepting packages, no passengers..."
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              multiline
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
            />
          </View>

          {/* Ride Description */}
          <View className="mb-4">
            <Text className="text-white text-base mb-2">
              Ride Description (Optional)
            </Text>
            <TextInput
              className="bg-white/20 rounded-lg py-3 px-4 text-white text-base h-24"
              placeholder="e.g., Type of vehicle, comfort level..."
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              multiline
              value={rideDescription}
              onChangeText={setRideDescription}
            />
          </View>
        </View>

        {/* Add Ride Button */}
        <TouchableOpacity
          className="bg-green-300 rounded-2xl py-4 items-center mb-6"
          onPress={handleSubmit}
        >
          <Text className="text-black text-lg font-bold">Add Ride</Text>
        </TouchableOpacity>

        {/* Confirmation Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showConfirmation}
          onRequestClose={handleConfirmationClose}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-lg p-6 w-4/5 items-center">
              <Ionicons name="checkmark-circle" size={50} color="#80ED99" />
              <Text className="text-lg font-bold mt-4 mb-2 text-center">
                Your ride has been added successfully!
              </Text>
              <TouchableOpacity
                className="bg-green-300 rounded-2xl py-3 px-6"
                onPress={handleConfirmationClose}
              >
                <Text className="text-black text-base font-bold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
}