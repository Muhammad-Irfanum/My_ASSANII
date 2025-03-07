import React, { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import CarouselComponent from "./carousel";

const HomeScreen = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate("Login");
    }
  }, [isAuthenticated, navigation]);

  const renderPerformanceCard = () => (
    <View className="bg-white rounded-2xl p-4 shadow-md items-center flex-1">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-[#073235] text-lg font-bold text-center">
          Overall Performance
        </Text>
      </View>
  
      <View className="items-center">
        <View className="w-32 h-32 rounded-full border-8 border-[#0AD1C8] items-center justify-center mb-2">
          <Text className="text-2xl font-bold text-[#073235]">350</Text>
        </View>
        <Text className="text-gray-600">You are doing good!</Text>
      </View>
    </View>
  );
  
  const renderRatingCard = () => (
    <View className="bg-white rounded-2xl p-4 shadow-md items-center flex-1">
      <Text className="text-lg font-bold text-[#073235] mb-4 text-center">
        How many stars have you received?
      </Text>
      <View className="flex-row justify-center">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <Ionicons
            key={index}
            name={index < 4 ? "star" : "star-half"}
            size={24}
            color="#FFD700"
          />
        ))}
      </View>
      <Text className="text-gray-600 mt-2 text-center">
        You have received 4.5 stars from your clients so far!
      </Text>
    </View>
  );
  

  const renderWeeklyOverview = () => (
    <View className="bg-white rounded-2xl p-4 shadow-md mt-4 items-center">
      <Text className="text-lg font-bold text-[#073235] mb-4 text-center">
        Weekly Overview
      </Text>
      <View className="h-40">{/* // chart comopnent */}</View>
      <View className=" items-center">
        <Text className="text-2xl font-bold text-[#0AD1C8]">30%</Text>
        <Text className="text-gray-600 ml-2 text-center">
          Your sales performance is 30% better compared to last month
        </Text>
      </View>
    </View>
  );

  if (!isAuthenticated) {
    return (
      <Text className="text-center mt-4 text-[#073235] text-lg">
        Please log in
      </Text>
    );
  }

  return (
    <LinearGradient colors={[ "#073235","#0AD1C8"]} className="flex-1">
      <View className="bg-[#097573] px-6 py-2 flex-row justify-between items-center rounded-b-[30]">
        <Image
          source={require("../../../assets/images/appicon.png")} // Replace with your actual logo
          className="w-12 h-12"
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1 " showsVerticalScrollIndicator={false}>
        <View className="pt-5 pb-5  px-6 ">
          <View className="flex-row items-center mt-2">
            <Image
              source={{
                uri:
                  user?.profileImage ||
                  "https://www.pngitem.com/pimgs/m/146-1462217_profile-icon-png-image-free-download-searchpng-employee.png",
              }}
              className="w-24 h-24 rounded-full border-2 border-white"
            />
            <View className="flex-1 ml-4">
              <Text className="text-white text-2xl font-bold">
                {user?.fullname}
              </Text>
              <View className="bg-white/20 rounded-full px-3 py-1 mt-2 self-start">
                <Text className="text-white text-md font-semibold">
                  {user?.userType || "Driver"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <CarouselComponent />

        

        <Text className="text-white text-2xl font-bold px-4 mt-8 mb-4 text-center">
          Performance
        </Text>

        <View className="flex-row flex-wrap justify-between px-4">
          <View className="flex-1 p-2">{renderPerformanceCard()}</View>
          <View className="flex-1 p-2">{renderRatingCard()}</View>
        </View>

        <View className="w-full  px-4">{renderWeeklyOverview()}</View>

        {/* Add this new Ride Card */}
<TouchableOpacity 
  className="bg-white rounded-2xl p-4 mx-4 mt-4 shadow-md flex-row items-center justify-between"
  onPress={() => navigation.navigate('ReviewsOverview')}
>
  <View className="flex-row items-center">
    <Ionicons name="car-sport" size={28} color="#073235" />
    <Text className="text-[#073235] text-lg font-bold ml-3">
      Recent Rides
    </Text>
  </View>
  <Ionicons name="arrow-forward" size={24} color="#073235" />
</TouchableOpacity>

      </ScrollView>

      

      <View className="bg-[#097573] flex-row justify-around items-center rounded-t-[30]">
        <TouchableOpacity
          className="py-4 px-6"
          onPress={() => navigation.navigate("ComplaintList")}
        >
          <Ionicons name="document-text-outline" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="py-4 px-6">
          <Ionicons name="car-outline" size={26} color="white" />
        </TouchableOpacity>
        <View className="px-5"></View>
        <TouchableOpacity className="left-[36%] bottom-[10%] items-center justify-center text-center py-3 w-[28%] px-6 absolute ">
          <View className="bg-green-400 rounded-full p-4">
            <Ionicons name="add" size={36} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="py-4 px-6">
          <Ionicons name="chatbubble-outline" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className="py-4 px-6"
          onPress={() => navigation.navigate("Editprofile")}
        >
          <Ionicons name="person-circle-outline" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="py-4 px-6">
          <Ionicons name="chatbubble-outline" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className="py-4 px-6"
          onPress={() => navigation.navigate("Editprofile")}
        >
          <Ionicons name="person-circle-outline" size={26} color="white" />
        </TouchableOpacity> 
      </View>
    </LinearGradient>
  );
};

export default HomeScreen;
