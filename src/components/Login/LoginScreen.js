import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Checkbox from 'expo-checkbox';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../Redux/actions/AuthHandling/authActions';
import { clearError } from '../../Redux/actions/Errorhandling/errorActions';
import { sendEmailVerification } from '../../Redux/actions/AuthHandling/authActions';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  const { errorMessage, errorCode } = useSelector(state => state.error);

  
  const handleLogin = () => {
    console.log('Logging in...');
    const result = dispatch(login(email, password));
    console.log('result', result);
    if (result.code === "notVerified") {
      console.log("Email is not verified. Please verify your email before logging in.");
    }
  };

  useEffect(() => {
    console.log('Checking login status...', isAuthenticated);

    if (isAuthenticated) {
      navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
    } else if (errorMessage) {
      console.log('Error on login page:', errorCode);

      if (errorCode === 'auth/unverified-email') {
        // Show alert for unverified email
        Alert.alert(
          'Email Not Verified',
          'Your email is not verified. Please verify your email to continue.',
          [
            {
              text: 'Verify Now',
              onPress: async () => {
                try {
                  // Trigger email verification
                  await dispatch(sendEmailVerification());
                  Alert.alert('Verification Email Sent', 'Please check your inbox to verify your email.');
                } catch (error) {
                  console.error('Error sending verification email:', error);
                  Alert.alert('Error', 'Failed to send verification email. Please try again.');
                }
              },
            },
            {
              text: 'Cancel',
              onPress: () => dispatch(clearError()), // Clear error on cancel
              style: 'cancel',
            },
          ],
          { cancelable: false }
        );
      } else {
        // Handle other errors
        Alert.alert(
          'Error',
          errorMessage,
          [
            {
              text: 'Dismiss',
              onPress: () => dispatch(clearError()), // Clear error on dismiss
            },
          ],
          { cancelable: false }
        );
      }
    }
  }, [isAuthenticated, errorMessage, navigation]);

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <LinearGradient colors={['#0AD1C8', '#073235']} className="flex-1 px-6 py-6">
      <View className="items-center mt-10">
        <Image
          source={require('../../../assets/images/logo.png')} // Provide the correct path to your logo
          className="w-40 h-40"
          resizeMode="contain"
        />
      </View>

      <Text className="text-white text-4xl font-bold text-center mt-8">WELCOME BACK</Text>
      <Text className="text-white text-lg text-center mt-2">LOGIN TO CONTINUE</Text>

      <View className="mt-8">
        <Text className="text-white text-lg mb-2">Email</Text>
        <TextInput
          style={{ backgroundColor: '#FFFFFF', borderRadius: 10 }}
          className="py-3 px-4 text-lg"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#A0A0A0"
          keyboardType="email-address"
        />
      </View>

      <View className="mt-6">
        <Text className="text-white text-lg mb-2">Password</Text>
        <TextInput
          style={{ backgroundColor: '#FFFFFF', borderRadius: 10 }}
          className="py-3 px-4 text-lg"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor="#A0A0A0"
          secureTextEntry
        />
      </View>

      <View className="flex-row justify-between items-center mt-6">
      <View className="flex-row items-center">
      <Checkbox
        value={rememberMe}
        onValueChange={toggleRememberMe}
        color={rememberMe ? '#0AD1C8' : undefined}
      />
      <TouchableOpacity onPress={toggleRememberMe}>
        <Text className="text-white  text-sm p-2">Remember me</Text>
      </TouchableOpacity>
    </View>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text className="text-white text-sm py-2 px-4 underline">Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="bg-green-300 rounded-2xl py-4 mt-8 mx-12 items-center"
        onPress={handleLogin}
      >
        <Text className="text-black text-lg font-bold">Login</Text>
      </TouchableOpacity>

      <View className="flex-row justify-center items-center  ">
        <Text className="text-white  text-md">Don't have an account? </Text>
        <TouchableOpacity className="  py-6 pr-6 " onPress={() => navigation.navigate('SignUp')}>
          <Text className="text-green-300 text-md font-bold">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
