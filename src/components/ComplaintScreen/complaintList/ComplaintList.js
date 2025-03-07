import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { fetchComplaints } from '../../../controllers/complaintController';

const { width } = Dimensions.get('window');

export default function ComplaintsListScreen() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const result = await fetchComplaints();
        if (result.success) {
          setComplaints(result.complaintsList);
        } else {
          setError('Failed to fetch complaints.');
        }
      } catch (err) {
        setError('An error occurred while fetching complaints.');
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, []);

  const handleComplaintPress = (complaint) => {
    navigation.navigate('ComplaintDetails', { complaint });
  };

  const handleRegisterComplaint = () => {
    navigation.navigate('Complaint');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#80ED99" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (complaints.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1055/1055645.png' }}
            style={styles.noComplaintsImage}
          />
          <Text style={styles.noComplaintsText}>No complaints yet</Text>
          <Text style={styles.noComplaintsSubText}>
            Great job! Keep up the excellent work.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.scrollView}>
        {complaints.map((complaint) => (
          <TouchableOpacity
            key={complaint.id}
            style={styles.card}
            onPress={() => handleComplaintPress(complaint)}
          >
            <View style={styles.cardHeader}>
              <Ionicons name="document-text-outline" size={24} color="#0AD1C8" />
              <Text style={styles.cardSubject}>{complaint.subject}</Text>
            </View>
            <Text style={styles.cardDescription}>{complaint.description}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardDate}>
                {new Date(complaint.timestamp).toLocaleDateString()}
              </Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#0AD1C8" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <LinearGradient colors={['#0AD1C8', '#073235']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Complaints</Text>
        <View style={{ width: 24 }} />
      </View>
      {renderContent()}
      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegisterComplaint}
      >
        <Text style={styles.registerButtonText}>Register a Complaint</Text>
        <Ionicons name="add-circle-outline" size={24} color="black" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardSubject: {
    color: '#073235',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  cardDescription: {
    color: '#555',
    fontSize: 14,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    color: '#888',
    fontSize: 12,
  },
  registerButton: {
    backgroundColor: '#80ED99',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  registerButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noComplaintsImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  noComplaintsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  noComplaintsSubText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});

