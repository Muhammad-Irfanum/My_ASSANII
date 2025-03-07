import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // You can use Ionicons for icons
import Animated from 'react-native-reanimated'; // Import Reanimated

const ErrorDialog = ({ message, onClose, isOpen }) => {
  const [showModal, setShowModal] = useState(false);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => setShowModal(false));
    }
  }, [isOpen, fadeAnim]);

  return (
    <Modal
      transparent
      visible={showModal}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Animated.View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: fadeAnim,
        }}
        onTouchStart={onClose}
      >
        <Animated.View
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            width: '80%',
            maxWidth: 400,
            padding: 20,
            opacity: fadeAnim,
            transform: [{ scale: fadeAnim }],
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Icon name="close-circle" size={24} color="red" />
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>Error</Text>
            <TouchableOpacity
              style={{ position: 'absolute', top: 0, right: 0 }}
              onPress={onClose}
            >
              <Icon name="close" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <Text style={{ color: 'red', marginBottom: 20 }}>{message}</Text>
          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: 'red',
              paddingVertical: 10,
              borderRadius: 5,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default ErrorDialog;
