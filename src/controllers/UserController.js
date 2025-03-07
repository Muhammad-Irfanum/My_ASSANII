import firestore from '@react-native-firebase/firestore';

/**
 * Add or update user data in Firestore
 * @param {string} userId
 * @param {object} data
 */
export const setUser = async (userId, data) => {
  return await firestore().collection('users').doc(userId).set(data);
};

/**
 * Fetch user data by ID
 * @param {string} userId
 */
export const getUser = async (userId) => {
  const doc = await firestore().collection('users').doc(userId).get();
  return doc.exists ? doc.data() : null;
};
