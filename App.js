import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import "./global.css";

//REDUX
import { Provider } from 'react-redux';
import store from './src/Redux/store/index';
import AppNavigator from './src/navigation/AppNavigator';

const Stack = createStackNavigator();

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'JockeyOne-Regular': require('./assets/fonts/JockeyOne-Regular.ttf'),
        'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
        'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
      });
      setFontsLoaded(true);
      await SplashScreen.hideAsync(); // Hide the splash screen when fonts are loaded
    }

    loadFonts();

    // Start listening to Firebase auth state changes
    // store.dispatch(listenToAuthState());
  }, []);

  if (!fontsLoaded) {
    return null; // Render nothing until fonts are loaded
  }

  return (
    <Provider store={store}>
    <NavigationContainer>
      <AppNavigator/>
    </NavigationContainer>
    </Provider>
  );
}