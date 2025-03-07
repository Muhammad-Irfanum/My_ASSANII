import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { addComplaint} from '../../controllers/complaintController';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
const categories = [
  "Delivery Issue",
  "Billing Problem",
  "Technical Support",
  "Other"
];

const priorities = [
  { label: "Low", color: "#4CAF50" },
  { label: "Medium", color: "#FFC107" },
  { label: "High", color: "#F44336" }
];

export default function ComplaintScreen({ navigation }) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Delivery Issue');
  const [priority, setPriority] = useState('Low');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);


  const { user,isAuthenticated } = useSelector((state) => state.auth);

   useEffect(() => {
      if (!isAuthenticated) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }], // Navigate to Login after logout
      });
      }
    }, [isAuthenticated, navigation]);

  const handleSubmit = () => {
    if (!subject.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    handleBackend();
  };

  const handleBackend = async () => {

  
    const result = await addComplaint({
      userId: user.uid,
      userEmail: user.email,
      subject,
      description,
      category,
      priority,
      status:"Pending",
      response:"",
      timestamp: new Date().toISOString()
    });
    if (result.success) {
      setShowConfirmation(true);
      // Reset form fields here
    } else {
      Alert.alert('Error', 'Failed to submit complaint. Please try again.');
    }
  };


  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  return (
    <LinearGradient
      colors={['#0AD1C8', '#073235']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Ionicons name="chatbox-ellipses" size={80} color="white" />
          <Text style={styles.headerText}>Submit a Complaint</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Delivery Delay"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowCategoryDropdown(true)}
          >
            <Text style={styles.dropdownButtonText}>{category}</Text>
            <Ionicons name="chevron-down" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Priority Level</Text>
          <View style={styles.radioContainer}>
            {priorities.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.radioButton}
                onPress={() => setPriority(item.label)}
              >
                <View style={[
                  styles.radio,
                  priority === item.label && { borderColor: item.color }
                ]}>
                  {priority === item.label && (
                    <View style={[styles.radioDot, { backgroundColor: item.color }]} />
                  )}
                </View>
                <Text style={styles.radioText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="e.g., My package was delayed by two days without notice..."
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            multiline
            numberOfLines={6}
            value={description}
            onChangeText={setDescription}
            maxLength={500}
          />
          <Text style={styles.charCount}>
            {description.length} / 500 characters
          </Text>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>
            Submit Complaint
          </Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showCategoryDropdown}
          onRequestClose={() => setShowCategoryDropdown(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {categories.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.modalItem}
                  onPress={() => {
                    setCategory(item);
                    setShowCategoryDropdown(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showConfirmation}
          onRequestClose={handleConfirmationClose}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.confirmationContent}>
              <Ionicons name="checkmark-circle" size={50} color="#80ED99" />
              <Text style={styles.confirmationText}>
                Your complaint has been successfully submitted!
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleConfirmationClose}
              >
                <Text style={styles.closeButtonText}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 15,
    color: 'white',
    fontSize: 16,
  },
  dropdownButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    color: 'white',
    fontSize: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  radioText: {
    color: 'white',
    fontSize: 16,
  },
  textArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 15,
    color: 'white',
    fontSize: 16,
    height: 150,
    textAlignVertical: 'top',
  },
  charCount: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'right',
  },
  submitButton: {
    backgroundColor: '#80ED99',
    borderRadius: 15,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  confirmationContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#80ED99',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

