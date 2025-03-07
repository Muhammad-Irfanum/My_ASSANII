// screens/AddPostScreen.js
import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  Image,
  Platform,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useCitySearch } from "../../../Hooks/useCitySearch";
import { useDeliveryCost } from "../../../Hooks/useDeliveryCost";
import { debounce } from "lodash";
const { width, height } = Dimensions.get("window");
import {
  captureImage,
  selectImageFromGallery,
} from "../../Signup/SignUpComponents/UploadImage";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

export default function AddPostScreen() {
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [size, setSize] = useState("");
  const [image, setImage] = useState(null);
  const [pickupCity, setPickupCity] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffCity, setDropoffCity] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState(new Date());
  const [prefferedTime, setPreferredTime] = useState(new Date());
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const navigation = useNavigation();
  const { user } = useSelector((state) => state.auth);

  // Custom hooks
  const {
    searchResults: pickupSearchResults,
    isSearching: isSearchingPickup,
    searchCity: searchPickupCity,
  } = useCitySearch();
  const {
    searchResults: dropoffSearchResults,
    isSearching: isSearchingDropoff,
    searchCity: searchDropoffCity,
  } = useCitySearch();
  const estimatedCost = useDeliveryCost(weight);

  // Debounced search functions
  const debouncedPickupSearch = useCallback(
    debounce(searchPickupCity, 1000),
    []
  );
  const debouncedDropoffSearch = useCallback(
    debounce(searchDropoffCity, 1000),
    []
  );

  const handleImagePick = async () => {
    Alert.alert(
      "Upload Image",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: async () => {
            const imageUri = await captureImage();
            if (imageUri) {
              setImage(imageUri);

              console.log("Image URI:", image);
            } else {
              Alert.alert(
                "Error",
                "Could not extract Verification Code. Please upload a valid image."
              );
            }
          },
        },
        {
          text: "Select from Gallery",
          onPress: async () => {
            const imageUri = await selectImageFromGallery();

            if (imageUri) {
              setImage(imageUri);
              console.log("Image URI:", image);
            } else {
              Alert.alert(
                "Error",
                "Could not extract Verification Code. Please upload a valid image."
              );
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || preferredDate;
    setShowDatePicker(Platform.OS === "ios"); // Keep the picker open on iOS, close on Android
    setPreferredDate(currentDate);

    // Hide the picker after selection on Android
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || prefferedTime;
    setShowTimePicker(Platform.OS === "ios"); // Keep the picker open on iOS, close on Android
    setPreferredTime(currentTime);

    // Hide the picker after selection on Android
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
  };

  const handleSubmit = () => {
    if (
      !description.trim() ||
      !weight.trim() ||
      !size.trim() ||
      !pickupCity.trim() ||
      !pickupAddress.trim() ||
      !dropoffCity.trim() ||
      !dropoffAddress.trim()
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    navigation.goBack();
  };

  const handleCitySelect = (city, setCity) => {
    setCity(city.display_name);
  };

  return (
    <LinearGradient colors={["#0AD1C8", "#073235"]} className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6 py-6"
      >
        <View className="flex-row items-center mb-6">
          <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold ml-4">
            Post Delivery Request
          </Text>
        </View>

        {/* Parcel Information */}
        <View className="mb-6">
          <Text className="text-white text-lg font-bold mb-4 border-b border-white/30 pb-2">
            Parcel Information
          </Text>

          <View className="mb-4">
            <Text className="text-white text-base mb-2">Item Description</Text>
            <TextInput
              className="bg-white/20 rounded-lg py-3 px-4 text-white text-base"
              placeholder="e.g., Books, Electronics, Clothing"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View className="flex-row justify-between mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-white text-base mb-2">
                Item Weight (kg)
              </Text>
              <TextInput
                className="bg-white/20 rounded-lg py-3 px-4 text-white text-base"
                placeholder="e.g., 2.5"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
            </View>

            <View className="flex-1 ml-2">
              <Text className="text-white text-base mb-2">
                Item Size (LxWxH)
              </Text>
              <TextInput
                className="bg-white/20 rounded-lg py-3 px-4 text-white text-base"
                placeholder="e.g., 30x20x15 cm"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={size}
                onChangeText={setSize}
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-white text-base mb-2">
              Upload Image (Optional)
            </Text>
            <TouchableOpacity
              onPress={handleImagePick}
              className="bg-white/20 rounded-lg h-32 justify-center items-center overflow-hidden"
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <View className="items-center">
                  <Ionicons name="camera" size={24} color="white" />
                  <Text className="text-white mt-2">Tap to upload</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Details */}
        <View className="mb-6">
          <Text className="text-white text-lg font-bold mb-4 border-b border-white/30 pb-2">
            Delivery Details
          </Text>

          {/* Pickup Location */}
          <View className="mb-4">
            <Text className="text-white text-base mb-2">Pickup City</Text>
            <View className="flex-row bg-white/20 rounded-lg items-center">
              <TextInput
                className="flex-1 py-3 px-4 text-white text-base"
                placeholder="Enter pickup city"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={pickupCity}
                onChangeText={(text) => {
                  setPickupCity(text);
                  debouncedPickupSearch(text);
                }}
              />
            </View>
            {isSearchingPickup && (
              <Text className="text-white mt-2">Searching...</Text>
            )}
            <FlatList
              data={pickupSearchResults}
              keyExtractor={(item) => item.place_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="bg-white/20 rounded-lg py-2 px-4 mt-2"
                  onPress={() => handleCitySelect(item, setPickupCity)}
                >
                  <Text className="text-white">{item.display_name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <View className="mb-4">
            <Text className="text-white text-base mb-2">Pickup Address</Text>
            <TextInput
              className="bg-white/20 rounded-lg py-3 px-4 text-white text-base"
              placeholder="Enter specific pickup address"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={pickupAddress}
              onChangeText={setPickupAddress}
            />
          </View>

          {/* Dropoff Location */}
          <View className="mb-4">
            <Text className="text-white text-base mb-2">Dropoff City</Text>
            <View className="flex-row bg-white/20 rounded-lg items-center">
              <TextInput
                className="flex-1 py-3 px-4 text-white text-base"
                placeholder="Enter dropoff city"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={dropoffCity}
                onChangeText={(text) => {
                  setDropoffCity(text);
                  debouncedDropoffSearch(text);
                }}
              />
            </View>
            {isSearchingDropoff && (
              <Text className="text-white mt-2">Searching...</Text>
            )}
            <FlatList
              data={dropoffSearchResults}
              keyExtractor={(item) => item.place_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="bg-white/20 rounded-lg py-2 px-4 mt-2"
                  onPress={() => handleCitySelect(item, setDropoffCity)}
                >
                  <Text className="text-white">{item.display_name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <View className="mb-4">
            <Text className="text-white text-base mb-2">Dropoff Address</Text>
            <TextInput
              className="bg-white/20 rounded-lg py-3 px-4 text-white text-base"
              placeholder="Enter specific dropoff address"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={dropoffAddress}
              onChangeText={setDropoffAddress}
            />
          </View>

          {/* // Date Picker */}
          <View className="mb-4">
            <Text className="text-white text-base mb-2">Departure Date</Text>
            <TouchableOpacity
              className="bg-white/20 rounded-lg py-3 px-4 flex-row justify-between items-center"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className="text-white text-base">
                {preferredDate.toLocaleDateString()}
              </Text>
              <Ionicons name="calendar" size={24} color="white" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                key="datePicker"
                value={preferredDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          {/* // Time Picker */}
          <View className="mb-4">
            <Text className="text-white text-base mb-2">Departure Time</Text>
            <TouchableOpacity
              className="bg-white/20 rounded-lg py-3 px-4 flex-row justify-between items-center"
              onPress={() => setShowTimePicker(true)}
            >
              <Text className="text-white text-base">
                {prefferedTime.toLocaleTimeString()}
              </Text>
              <Ionicons name="time" size={24} color="white" />
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                key="timePicker"
                value={prefferedTime}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>

          {/* Special Instructions */}
          <View className="mb-2">
            <Text className="text-white text-base mb-2">
              Special Instructions (Optional)
            </Text>
            <TextInput
              className="bg-white/20 rounded-lg py-3 px-4 text-white text-base h-24"
              placeholder="e.g., Fragile items, specific handling instructions..."
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
            />
          </View>
        </View>

        {/* Estimated Cost */}
        <View className="bg-white/30 rounded-lg p-4 mb-2 flex-row justify-between items-center">
          <Text className="text-white text-base font-bold">
            Estimated Delivery Cost
          </Text>
          <Text className="text-white text-2xl font-bold">
            ${estimatedCost}
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-green-300 rounded-2xl py-4 items-center mb-10"
          onPress={handleSubmit}
        >
          <Text className="text-black text-lg font-bold">
            Post Delivery Request
          </Text>
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
                Your delivery request has been posted successfully!
              </Text>
              <Text className="text-sm mb-4 text-center text-gray-600">
                Nearby travelers will be notified of your request.
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
const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
    marginBottom: 20,
  },
  image: {
    width: width * 0.8,
    height: width * 0.55,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
  },
});
