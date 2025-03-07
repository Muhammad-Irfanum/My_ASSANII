import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from 'react-redux';
import { sendPasswordResetEmail } from '../../Redux/actions/AuthHandling/authActions'; // Import Redux action

const { width } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const handleForgotPassword = async () => {
    console.log('Sending password reset email...');
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    try {
      const result = await dispatch(sendPasswordResetEmail(email)); // Dispatch Redux action
      if (result.success) {
        Alert.alert(
          'Success',
          'A password reset email has been sent. Please check your inbox.'
        );
        setEmail(''); // Clear the input field
      } else {
        Alert.alert('Error', result.message); // Display the message returned by the action
      }
    } catch (error) {
      console.error('Forgot Password Error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#0AD1C8', '#073235']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>AASANI</Text>
        <Text style={styles.forgotPasswordText}>FORGOT PASSWORD</Text>
        <Text style={styles.descriptionText}>
          No worries! Enter your email address below and we will send you a code to reset password.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>EMAIL</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#A0A0A0"
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity style={styles.sendRequestButton} onPress={handleForgotPassword}>
          <Text style={styles.sendRequestButtonText}>SEND REQUEST</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontFamily: 'JockeyOne-Regular',
    fontSize: 40,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 60,
  },
  forgotPasswordText: {
    fontFamily: 'JockeyOne-Regular',
    fontSize: 30,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  descriptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  sendRequestButton: {
    backgroundColor: '#80ED99',
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    marginHorizontal: width > 400 ? 50 : 30,
    alignItems: 'center',
  },
  sendRequestButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: 'black',
  },
});
