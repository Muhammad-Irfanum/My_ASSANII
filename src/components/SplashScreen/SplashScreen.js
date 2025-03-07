import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, Dimensions, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'; // Import from expo-linear-gradient

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Navigate to Login after 3 seconds
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);

    return () => clearTimeout(timer); // Clear timer on component unmount
  }, [fadeAnim, navigation]);

  return (
    <LinearGradient
      colors={['#0AD1C8', '#073235']}
      style={styles.container}
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={require('../../../assets/images/logo.png')} // Replace with the path to your logo
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
  },
});
