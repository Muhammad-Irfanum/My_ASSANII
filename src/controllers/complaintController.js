import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const complaintsCollection = firestore().collection('Complaints');

// Add a new complaint
export const addComplaint = async (complaintData) => {
  try {
    const documentReference = await complaintsCollection.add(complaintData);
    return { success: true, id: documentReference.id };
  } catch (error) {
    return { success: false, error };
  }
};

// Update a complaint
export const updateComplaint = async (id, updateData) => {
  try {
    await complaintsCollection.doc(id).update(updateData);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

// Delete a complaint
export const deleteComplaint = async (id) => {
  try {
    await complaintsCollection.doc(id).delete();
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

// Fetch all complaints
export const fetchComplaints = async () => {
  try {
    const currentUserEmail = auth().currentUser.email; // Get the authenticated user's email
    console.log('Current user email:', currentUserEmail);
    const snapshot = await complaintsCollection.where('userEmail', '==', currentUserEmail).get(); // Query documents
    const complaintsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Fetched complaints:', complaintsList);
    return { success: true, complaintsList };
  } catch (error) {
    return { success: false, error };
  }
};
