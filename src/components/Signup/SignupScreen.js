import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";
import { CheckEmail } from "../../Redux/actions/AuthHandling/authActions"; // Adjust the import to your method file
import { useDispatch } from 'react-redux';

export default function SignUpScreen() {
  const dispatch = useDispatch();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isDriver, setIsDriver] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [emailError, setEmailError] = useState(null); // To store email validation errors
  const [emailChecking, setEmailChecking] = useState(false); // To indicate email is being checked
  const [fullnameError, setFullnameError] = useState(null); // Fullname validation error
  const [phoneError, setPhoneError] = useState(null); // Phone number validation error
  const navigation = useNavigation();

  const userType = isDriver ? "Driver" : "User ";

  // Handle Sign Up
  const handleSignUp = async () => {
    if (!agreeToTerms) {
      Alert.alert("Error", "You must agree to the terms and conditions.");
      return;
    }

    if (!fullname || !email || !password || !phone) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    // Phone number validation
    if (phone.length !== 11 || !/^\d+$/.test(phone)) {
      Alert.alert("Error", "Enter a valid phone number (11 digits). Format 03xxxxxxxxx");
      return;
    }

    if (emailError) {
      Alert.alert("Error", emailError);
      return;
    }

    if (fullnameError) {
      Alert.alert("Error", fullnameError);
      return;
    }

    try {
      navigation.navigate("ScanNID", {
        fullname,
        email,
        password,
        phone,
        userType,
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Email Validation Function
  const isValidEmail = (email) => {
    // Regular expression to validate email with only one "@" and must contain ".com"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[com]{3}$/i;
    return emailRegex.test(email);
  };

  // Fullname Validation Function (only letters)
  const isValidFullname = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name);
  };

  // Email Checking (useEffect)
  useEffect(() => {
    const checkEmailValidity = async () => {
      if (email && isValidEmail(email)) {
        setEmailChecking(true);
        try {
          const result = await dispatch(CheckEmail(email));
          if (!result.isValid) {
            setEmailError(result.message);
          } else {
            setEmailError(null); // Clear error if email is valid
          }
        } catch (error) {
          console.error("Email check failed:", error);
          setEmailError(error.message || "An error occurred while checking the email.");
        } finally {
          setEmailChecking(false);
        }
      } else {
        setEmailError("Please enter a valid email.");
      }
    };

    // Debounce email checking (2 seconds after user stops typing)
    const timeoutId = setTimeout(() => {
      checkEmailValidity();
    }, 2000);

    // Cleanup timeout on email change
    return () => clearTimeout(timeoutId);
  }, [email, dispatch]);

  // Fullname Checking (useEffect)
  useEffect(() => {
    if (fullname && !isValidFullname(fullname)) {
      setFullnameError("Full name must contain only letters and spaces.");
    } else {
      setFullnameError(null);
    }
  }, [fullname]);

  return (
    <LinearGradient colors={["#0AD1C8", "#073235"]} className="flex-1 px-5">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        className=" px-[3%]"
      >
        <Text className="text-4xl text-white text-center mt-16 font-bold">
          AASANI
        </Text>
        <Text className="text-2xl text-white text-center mt-5 mb-8 font-bold">
          CREATE ACCOUNT NOW!
        </Text>

        <View className="mb-5">
          <Text className="text-white text-base mb-2">Full name</Text>
          <TextInput
            className="bg-white rounded-lg p-3 text-base"
            value={fullname}
            onChangeText={setFullname}
            placeholder="Enter your full name"
            placeholderTextColor="#A0A0A0"
          />
          {fullnameError && <Text className="text-red-500">{fullnameError}</Text>}
        </View>

        <View className="mb-5">
          <Text className="text-white text-base mb-2">Email</Text>
          <TextInput
            className="bg-white rounded-lg p-3 text-base"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#A0A0A0"
            keyboardType="email-address"
          />
          {emailError && <Text className="text-red-500 ">{emailError}</Text>}
        </View>

        <View className="mb-5">
          <Text className="text-white text-base mb-2">Password</Text>
          <TextInput
            className="bg-white rounded-lg p-3 text-base"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#A0A0A0"
            secureTextEntry
          />
        </View>

        <View className="mb-5">
          <Text className="text-white text-base mb-2">Phone No</Text>
          <TextInput
            className="bg-white rounded-lg p-3 text-base"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            placeholderTextColor="#A0A0A0"
            keyboardType="phone-pad"
          />
          {phoneError && <Text className="text-red-500">{phoneError}</Text>}
        </View>

        <View className="flex-row bg-white rounded-full mt-5">
          <TouchableOpacity
            className={`flex-1 py-2 rounded-full ${!isDriver ? "bg-green-300" : ""}`}
            onPress={() => setIsDriver(false)}
          >
            <Text className={`text-center ${!isDriver ? "text-black font-extrabold" : "text-gray-800"}`}>
              User
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 rounded-full ${isDriver ? "bg-green-300 " : ""}`}
            onPress={() => setIsDriver(true)}
          >
            <Text className={`text-center ${isDriver ? "text-black font-extrabold" : "text-gray-800"}`}>
              Driver
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mt-5">
          <Checkbox
            value={agreeToTerms}
            onValueChange={setAgreeToTerms}
            color={agreeToTerms ? "#80ED99" : undefined}
          />
          <Text className="ml-3 text-white">I agree to terms & conditions</Text>
        </View>

        <TouchableOpacity
          className="bg-green-300 rounded-2xl p-4 mt-5"
          onPress={handleSignUp}
        >
          <Text className="text-black text-center font-bold text-lg">
            Sign Up
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center p-5">
          <Text className="text-white ">Back to </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="text-green-400 pr-5 py-3  text-lg font-bold">Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
