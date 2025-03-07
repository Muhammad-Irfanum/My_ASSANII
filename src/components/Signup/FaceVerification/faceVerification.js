import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { captureImage, selectImageFromGallery } from "../SignUpComponents/UploadImage";
import { useDispatch } from "react-redux";
import { uploadFile } from "../../../Redux/actions/StorageHandling/StorageActions";
import { signup } from "../../../Redux/actions/AuthHandling/authActions";
import LoadingSpinner from "../../LoadingSpinnner/LoadingSpinner";
import { extractVerification } from "../../../controllers/extractCnic";

const { width, height } = Dimensions.get("window");
const cameraPlaceholder = require("../../../../assets/images/camera_image.png");

export default function FaceVerificationScreen({ route,navigation }) {
  const [faceVerificationImage, setFaceVerificationImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [extractedCode, setExtractedCode] = useState("");
  const dispatch = useDispatch();

  // const route = {
  //   params: {
  //     fullname: "John Doe",
  //     email: "abc@gmail.com",
  //     password: "123456",
  //     phone: "123456789",
  //     userType: "user",
  //     frontNIDImage: "https://example.com/frontNIDImage.jpg",
  //     backNIDImage: "https://example.com/backNIDImage.jpg",
  //     cnic: "1234567890123",
  //   },
  // };

  useEffect(() => {
    generateVerificationCode();
  }, []);

  useEffect(() => {
    // Check if the verification code matches the extracted code
    if (verificationCode.toString() === extractedCode) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [verificationCode, extractedCode]);

  const generateVerificationCode = () => {
    const code = Math.floor(Math.random() * 900000) + 100000; // Generates a number from 100000 to 999999
    setVerificationCode(code);
  };

  const handleSignUp = async () => {
    if (!faceVerificationImage) {
      Alert.alert("Error", "Please upload a face image before proceeding.");
      return;
    }

    setLoading(true);

    try {
      const downloadUrlFaceVerificationPicture = await dispatch(
        uploadFile(faceVerificationImage, "FaceVerificationPictures")
      );

      const {
        fullname,
        email,
        password,
        phone,
        userType,
        frontNIDImage,
        backNIDImage,
        cnic,
      } = route.params;

      if (
        !fullname ||
        !email ||
        !password ||
        !phone ||
        !userType ||
        !frontNIDImage ||
        !backNIDImage ||
        !cnic
      ) {
        Alert.alert("Error", "Some user data is missing. Please try again.");
        return;
      }

      const userData = {
        fullname,
        email,
        password,
        phone,
        userType,
        frontNIDImage,
        backNIDImage,
        cnic,
        faceVerificationImage: downloadUrlFaceVerificationPicture,
        verificationCode, // Add verification code to user data
        createdAt: new Date().toISOString(),
      };

      const response = await dispatch(signup(userData));
      if (response?.success) {
        Alert.alert("Success", "Account created successfully!");
        navigation.navigate("Login");
      } else {
        Alert.alert(
          "Error",
          response.error.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during signup:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              try {
                const extractedverificationcode = await extractVerification(imageUri);
                if (extractedverificationcode) {
                  console.log("Extracted Verification Code:", extractedverificationcode);
                  setExtractedCode(extractedverificationcode);
                  setFaceVerificationImage(imageUri);
                } else {
                  Alert.alert("Error", "Could not extract Verification Code. Please upload a valid image.");
                }
              } catch (error) {
                console.error("Error extracting Verification Code:", error);
                Alert.alert("Error", "There was an issue extracting the Verification Code. Please try again.");
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
                const extractedverificationcode = await extractVerification(imageUri);
                if (extractedverificationcode) {
                  console.log("Extracted Verification Code:", extractedverificationcode);
                  setExtractedCode(extractedverificationcode);
                  setFaceVerificationImage(imageUri);
                } else {
                  Alert.alert("Error", "Could not extract Verification Code. Please upload a valid image.");
                }
              } catch (error) {
                console.error("Error extracting Verification Code:", error);
                Alert.alert("Error", "There was an issue extracting the Verification Code. Please try again.");
              }
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

  return (
    <LinearGradient colors={["#0AD1C8", "#073235"]} style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../../../../assets/images/FaceVerificationimage.png")}
          style={styles.logo}
        />

        <Text style={styles.codeText}>Verification Code:</Text>
        <Text style={styles.code}>{verificationCode}</Text>

        <Text style={styles.instruction}>
          Write this code on a piece of paper and take a photo of yourself holding it.
        </Text>

        <TouchableOpacity onPress={handleImagePick} style={styles.imageContainer}>
          <Image
            source={faceVerificationImage ? { uri: faceVerificationImage } : cameraPlaceholder}
            style={styles.image}
          />
          {loading && <LoadingSpinner />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isButtonDisabled ? styles.disabledButton : null]}
          onPress={handleSignUp}
          disabled={isButtonDisabled}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    width: "90%",
  },
  logo: {
    width: width * 0.45,
    height: width * 0.45,
    marginBottom: 20,
  },
  codeText: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
  code: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  instruction: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
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
  button: {
    backgroundColor: "#80ED99",
    borderRadius: 15,
    paddingVertical: 15,
    width: "80%",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});