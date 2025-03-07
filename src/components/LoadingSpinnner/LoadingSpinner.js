// LoadingSpinner.js
import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

const LoadingSpinner = ({ size = "large", color = "white", style = {} }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
});

export default LoadingSpinner;
