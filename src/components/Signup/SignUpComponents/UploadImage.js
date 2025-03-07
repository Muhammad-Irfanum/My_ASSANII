import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

/**
 * Launches the camera and captures an image.
 * @returns {Promise<string | null>} - The URI of the captured image, or null if canceled.
 */
export const captureImage = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert('Permission Denied', 'Camera access is required to take a photo.');
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri; // Return the URI of the captured image
  }

  return null; // Return null if the operation is canceled
};

/**
 * Opens the gallery for the user to select an image.
 * @returns {Promise<string | null>} - The URI of the selected image, or null if canceled.
 */
export const selectImageFromGallery = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert('Permission Denied', 'Gallery access is required to select an image.');
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: "images",
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri; // Return the URI of the selected image
  }

  return null; // Return null if the operation is canceled
};
