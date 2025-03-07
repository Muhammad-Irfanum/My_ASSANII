import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ComplaintDetailsScreen({ route }) {
  const { complaint } = route.params;
  const navigation = useNavigation();

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open':
        return '#FFD700';
      case 'in progress':
        return '#1E90FF';
      case 'resolved':
        return '#32CD32';
      default:
        return '#FF6347';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'alert-circle';
      case 'medium':
        return 'alert';
      case 'low':
        return 'information-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <LinearGradient colors={['#0AD1C8', '#073235']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Complaint Details</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <View style={styles.subjectContainer}>
            <Ionicons name="document-text" size={24} color="#0AD1C8" />
            <Text style={styles.subjectText}>{complaint.subject}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="pricetag" size={20} color="#0AD1C8" />
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{complaint.category}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name={getPriorityIcon(complaint.priority)} size={20} color="#0AD1C8" />
            <Text style={styles.label}>Priority:</Text>
            <Text style={styles.value}>{complaint.priority}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="radio-button-on" size={20} color={getStatusColor(complaint.status)} />
            <Text style={styles.label}>Status:</Text>
            <Text style={[styles.value, { color: getStatusColor(complaint.status) }]}>{complaint.status}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time" size={20} color="#0AD1C8" />
            <Text style={styles.label}>Time:</Text>
            <Text style={styles.value}>{new Date(complaint.timestamp).toLocaleString()}</Text>
          </View>

          

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>subject:</Text>
            <Text style={styles.descriptionText}>{complaint.subject}</Text>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Description:</Text>
            <Text style={styles.descriptionText}>{complaint.description}</Text>
          </View>


          <View style={styles.responseContainer}>
            <Text style={styles.responseLabel}>Response:</Text>
            <Text style={styles.responseText}>
              {complaint.response || 'No response yet'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    margin: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  subjectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  subjectText: {
    color: '#073235',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    color: '#073235',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    width: 80,
  },
  value: {
    color: '#555',
    fontSize: 16,
    flex: 1,
  },
  descriptionContainer: {
    marginTop: 20,
  },
  descriptionLabel: {
    color: '#073235',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    color: '#555',
    fontSize: 16,
    lineHeight: 24,
  },
  responseContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(10, 209, 200, 0.1)',
    borderRadius: 10,
    padding: 15,
  },
  responseLabel: {
    color: '#073235',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  responseText: {
    color: '#555',
    fontSize: 16,
    fontStyle: 'italic',
  },
});

