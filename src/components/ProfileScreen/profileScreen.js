import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../Redux/actions/AuthHandling/authActions';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { captureImage, selectImageFromGallery } from '../Signup/SignUpComponents/UploadImage';
import { useNavigation } from '@react-navigation/native';
import { editUser } from '../../Redux/actions/FirestoreHandling/FirestoreActions';
import { uploadFile } from '../../Redux/actions/StorageHandling/StorageActions';

const EditProfileScreen = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [fullname, setFullname] = useState('');
  const [profileImage, setProfileImage] = useState('https://liccar.com/wp-content/uploads/png-transparent-head-the-dummy-avatar-man-tie-jacket-user.png');
  const [selectedImageUri, setSelectedImageUri] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], // Navigate to Login after logout
    });
    }
  }, [isAuthenticated, navigation]);

  useEffect(() => {
    if (user) {
      setFullname(user.fullname || '');
      setProfileImage(user.profileImage || 'https://liccar.com/wp-content/uploads/png-transparent-head-the-dummy-avatar-man-tie-jacket-user.png');
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleUpdateProfile = async () => {
    try {
      let imageUrl = profileImage;
      if (selectedImageUri) {
        console.log('Uploading image profile screen:', selectedImageUri);
        imageUrl = await dispatch(uploadFile(selectedImageUri, 'ProfileImages'));
      }

      const userData = {
        uid: user.uid,
        fullname,
        profileImage: imageUrl,
      };

      const response = await dispatch(editUser(userData));
      if (response.success) {
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error during profile update:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  const handleImagePick = async () => {
    Alert.alert(
      'Upload Image',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const imageUri = await captureImage();
            if (imageUri) {
              setSelectedImageUri(imageUri);
              setProfileImage(imageUri);
            }
          },
        },
        {
          text: 'Select from Gallery',
          onPress: async () => {
            const imageUri = await selectImageFromGallery();
            if (imageUri) {
              setSelectedImageUri(imageUri);
              setProfileImage(imageUri);
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0AD1C8" />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">User not found. Please log in.</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0AD1C8', '#073235']} className="flex-1">
      <ScrollView className="flex-1 px-4 py-3 overflow-scroll">
        <View className="items-center mb-6">
          <TouchableOpacity onPress={handleImagePick} className="relative">
            <Image source={{ uri: profileImage }} className="w-32 h-32 rounded-full" />
            <View className="absolute bottom-0 right-0 bg-white rounded-full p-2">
              <Ionicons name="camera" size={24} color="#0AD1C8" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <Text className="text-lg font-bold text-[#073235] mb-4">Edit Profile</Text>

          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">Full Name</Text>
            <TextInput
              value={fullname}
              onChangeText={setFullname}
              className="border border-gray-300 rounded-lg p-2 text-[#073235]"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">Email</Text>
            <Text className="p-2 text-[#073235]">{user.email}</Text>
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">Phone</Text>
            <Text className="p-2 text-[#073235]">{user.phone}</Text>
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">CNIC</Text>
            <Text className="p-2 text-[#073235]">{user.cnic}</Text>
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">User Type</Text>
            <Text className="p-2 text-[#073235]">{user.userType}</Text>
          </View>

          

          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">Verification Status</Text>
            <Text className="p-2 text-[#073235]">{user.isverified ? 'Verified' : 'Not Verified'}</Text>
          </View>

          <TouchableOpacity
            onPress={handleUpdateProfile}
            className="bg-[#0AD1C8] rounded-lg py-3 items-center mt-4"
          >
            <Text className="text-white font-bold">Update Profile</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 rounded-lg py-3 items-center mb-8"
        >
          <Text className="text-white font-bold">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default EditProfileScreen;
