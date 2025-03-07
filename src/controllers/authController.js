import auth from '@react-native-firebase/auth';

/**
 * Create a new user
 * @param {string} email
 * @param {string} password
 */
export const signUp = async (email, password) => {
  return await auth().createUserWithEmailAndPassword(email, password);
};

/**
 * Log in a user
 * @param {string} email
 * @param {string} password
 */
export const logIn = async (email, password) => {
  return await auth().signInWithEmailAndPassword(email, password);
};

/**
 * Log out the current user
 */
export const logOut = async () => {
  return await auth().signOut();
};
