// ScanNIDScreen.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { captureImage, selectImageFromGallery } from "./UploadImage";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../../../Redux/actions/StorageHandling/StorageActions"; 
import LoadingSpinner from "../../LoadingSpinnner/LoadingSpinner"; 
import {  extractText } from "../../../controllers/extractCnic"; 

const { width } = Dimensions.get("window");
const cameraPlaceholder = require("../../../../assets/images/camera_image.png");

export default function ScanNIDScreen({route, navigation }) {
  const [frontNIDImage, setFrontNIDImage] = useState(null);
  const [backNIDImage, setBackNIDImage] = useState(null);
  const [cnic, setCnic] = useState(Array(13).fill(""));
  const [frontExtractedCnic, setfrontExtractedCNIC] = useState(null);
  const [backExtractedCnic, setBackExtractedCNIC] = useState(null);


  const { fullname, email, password, phone, userType } = route.params || {};

  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const { loading, error, downloadUrl } = useSelector((state) => state.storage);

  const handleImagePick = async (side) => {
    Alert.alert(
      "Upload Image",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: async () => {
            const imageUri = await captureImage();
            if (imageUri) {
              try {
                
                const extractedCnic = await extractText(imageUri);
                if (extractedCnic) {
                  console.log("Extracted CNIC:", extractedCnic);
                  if (side === "front") {
                    setfrontExtractedCNIC(extractedCnic);
                    setFrontNIDImage(imageUri);
                  } else {
                    setBackExtractedCNIC(extractedCnic);
                    setBackNIDImage(imageUri);
                  }
                } else {
                  Alert.alert("Error", "Could not extract CNIC. Please upload a valid image.");
                }
              } catch (error) {
                console.error("Error extracting CNIC:", error);
                Alert.alert("Error", "There was an issue extracting the CNIC. Please try again.");
              }
            }
          },
        },
        {
          text: "Select from Gallery",
          onPress: async () => {
            const imageUri = await selectImageFromGallery();
            if (imageUri) {
              try {
                
                const extractedCnic = await extractText(imageUri);
                if (extractedCnic) {
                  console.log("Extracted CNIC:", extractedCnic);
                  if (side === "front") {
                    setfrontExtractedCNIC(extractedCnic);
                    setFrontNIDImage(imageUri);
                  } else {
                    setBackExtractedCNIC(extractedCnic);
                    setBackNIDImage(imageUri);
                  }
                } else {
                  Alert.alert("Error", "Could not extract CNIC. Please upload a valid image.");
                }
              } catch (error) {
                console.error("Error extracting CNIC:", error);
                Alert.alert("Error", "There was an issue extracting the CNIC. Please try again.");
              }
            }
          },
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancelled"),
          style: "cancel",
        },
      ]
    );
  };

  const handleSignup = async () => {
    const fullCnic = cnic.join("");
    if (fullCnic.length !== 13) {
      Alert.alert("Error", "Please enter a valid CNIC.");
      return;
    }

    try {
      const downloadUrlFrontNIDPicture = await dispatch(uploadFile(frontNIDImage, "FrontNIDPictures"));
      const downloadUrlBackNIDPicture = await dispatch(uploadFile(backNIDImage, "BackNIDPictures"));

      navigation.navigate("FaceVerification", {
        fullname,
        email,
        password,
        phone,
        userType,
        frontNIDImage: downloadUrlFrontNIDPicture,
        backNIDImage: downloadUrlBackNIDPicture,
        cnic: fullCnic,
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      Alert.alert("Error", "There was an issue uploading the files. Please try again.");
    }
  };

  const isSubmitEnabled =
    frontExtractedCnic === backExtractedCnic &&
    frontExtractedCnic === cnic.join("");

  const handleChange = (index, value) => {
    const newCnic = [...cnic];
    newCnic[index] = value.replace(/[^0-9]/g, "");
    setCnic(newCnic);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (event, index) => {
    if (event.key === "Backspace" && !cnic[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <LinearGradient colors={["#0AD1C8", "#073235"]} style={{ flex: 1, padding: 20 }}>
          <Text className="text-white text-center font-bold text-3xl my-8">Scan Your CNIC</Text>

          <View className="items-center mb-8">
            <Text className="text-white text-lg mb-2">Front Side</Text>
            <TouchableOpacity onPress={() => handleImagePick("front")}>
              <View style={{ position: "relative" }}>
                <Image
                  source={frontNIDImage ? { uri: frontNIDImage } : cameraPlaceholder}
                  style={{
                    width: width * 0.6,
                    height: width * 0.35,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: "white",
                  }}
                />
                {loading && <LoadingSpinner />}
              </View>
            </TouchableOpacity>
          </View>

          <View className="items-center mb-8">
            <Text className="text-white text-lg mb-2">Back Side</Text>
            <TouchableOpacity onPress={() => handleImagePick("back")}>
              <View style={{ position: "relative" }}>
                <Image
                  source={backNIDImage ? { uri: backNIDImage } : cameraPlaceholder}
                  style={{
                    width: width * 0.6,
                    height: width * 0.35,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: "white",
                  }}
                />
                {loading && <LoadingSpinner />}
              </View>
            </TouchableOpacity>
          </View>

          <View className="items-center mt-5">
            <Text className="text-white text-lg mb-3">Enter CNIC</Text>
            <View className="flex-row justify-center items-center">
              {cnic.map((digit, index) => (
                <React.Fragment key={index}>
                  <TextInput
                    ref={(el) => (inputRefs.current[index] = el)}
                    maxLength={1}
                    keyboardType="number-pad"
                    className="w-[6%] h-[110%] bg-white text-black text-center text-lg rounded-md mx-[0.5%]"
                    value={digit}
                    onChangeText={(value) => handleChange(index, value)}
                    onKeyPress={(event) => handleBackspace(event.nativeEvent, index)}
                  />
                  {index === 4 || index === 11 ? <Text className="text-white text-lg mx-1">-</Text> : null}
                </React.Fragment>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: isSubmitEnabled ? "#0AD1C8" : "#a1a1a1",
              paddingVertical: 12,
              borderRadius: 8,
              marginTop: 20,
            }}
            onPress={handleSignup}
            disabled={!isSubmitEnabled}
          >
            <Text style={{ color: "white", fontSize: 18, textAlign: "center" }}>Submit</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
