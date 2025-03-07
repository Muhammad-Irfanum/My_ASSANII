import { SET_AUTH, SET_LOADING, LOGOUT } from "./authTypes";
import auth from "@react-native-firebase/auth";
import { addUser } from "../FirestoreHandling/FirestoreActions"; // Import addUser action
import firestore from "@react-native-firebase/firestore";
import { setError, clearError } from "../Errorhandling/errorActions";

export const signup = (userdata) => async (dispatch) => {
  console.log("Signup action called", userdata.email, userdata.password);
  console.log("Signup action called", userdata);

  try {
    // Step 1: Create user with email and password using Firebase Auth
    const userCredential = await auth().createUserWithEmailAndPassword(
      userdata.email,
      userdata.password
    );
    const user = userCredential.user;

    if (!user) {
      dispatch(setError({ code: error.code, message: error.message }));
      throw {
        code: "auth/unknown-error",
        message: "An unknown error occurred while creating the user.",
      };
    }
    console.log("User created:", user);

    // Step 2: Prepare the user data to store in Firestore
    const userDocData = {
      uid: user.uid,
      email: user.email,
      fullname: userdata.fullname,
      phone: userdata.phone,
      userType: userdata.userType,
      frontNIDImage: userdata.frontNIDImage,
      backNIDImage: userdata.backNIDImage,
      cnic: userdata.cnic,
      faceVerificationImage: userdata.faceVerificationImage, // Storing the image URL if available
      verificationCode: userdata.verificationCode,
      createdAt: userdata.createdAt,
    };

    // Step 3: Dispatch the addUser action to save user data to Firestore
    dispatch(addUser(userDocData));
    dispatch(sendEmailVerification());
    // Optional: Return the userCredential for further handling
    return { success: true, userCredential };
  } catch (error) {
    return { success: false, error: error }; // Return a structured error message
  }
};

// Action to login using email and password
export const login = (email, password) => async (dispatch) => {
  console.log("Login action called", email, password);
  try {
    dispatch(setLoading(true)); // Set loading state to true

    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user;

    if (!user.emailVerified) {
      dispatch(
        setError({
          code: "auth/unverified-email",
          message:
            "Email is not verified. Please verify your email before logging in.",
        })
      );
      return;
    }

    const emailLowerCase = user.email.toLowerCase();

    // Query Firestore to find the user by email
    const userSnapshot = await firestore()
      .collection("users") // Ensure this is the correct collection
      .where("email", "==", emailLowerCase) // Correct field name for email
      .get();

    if (userSnapshot.empty) {
      console.log("User not found. Please register first.");
      dispatch(
        setError({
          code: "auth/user-not-found",
          message: "User not found. Please register first.",
        })
      );
      return;
    }

    // Assuming user exists and has verified email
    const userData = userSnapshot.docs[0].data(); // Get data from the first document
    console.log("User data:", userData);

    dispatch(setAuth(userData));
    dispatch(setLoading(false)); // Set loading state to false after login
    dispatch(clearError());
  } catch (error) {
    console.log("Login error:", error.code);
    dispatch(setLoading(false)); // Set loading state to false on error
    switch (error.code) {
      case "auth/user-not-found":
        dispatch(setError({ code: error.code, message: "User not found." }));
        break;
      case "auth/wrong-password":
        dispatch(setError({ code: error.code, message: "Wrong password." }));
        break;
      case "auth/too-many-requests":
        dispatch(
          setError({
            code: error.code,
            message: "Too many requests. Try again later.",
          })
        );
        break;
      case "auth/user-disabled":
        dispatch(setError({ code: error.code, message: "User disabled." }));
        break;
      case "auth/invalid-credential":
        dispatch(setError({ code: error.code, message: "Invalid credential." }));
        break;
      default:
        dispatch(
          setError({
            code: error.code,
            message: "An unexpected error occurred.",
          })
        );
    }
  }
};


// Action to logout
export const logout = () => async (dispatch) => {
  try {
    dispatch(setLoading(true)); // Set loading state to true during logout
    await auth().signOut();
    dispatch(setlogout());
    dispatch(setLoading(false)); // Set loading state to false after logout
  } catch (error) {
    dispatch(setLoading(false)); // Set loading state to false on error
    dispatch(setError({ code: error.code, message: error.message }));
  }
};

// Action to listen to auth state changes
export const listenToAuthState = () => async (dispatch) => {
  auth().onAuthStateChanged((user) => {
    if (user) {
      // Extracting serializable properties
      const serializableUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
      };

      dispatch(setAuth(serializableUser));
    } else {
      dispatch(setlogout());
    }
  });
};

export const CheckEmail = (email) => async (dispatch) => {
  try {
    // Check if email is already used in Firebase Authentication
    const signInMethods = await auth().fetchSignInMethodsForEmail(email);
    console.log("Sign-in methods:", signInMethods);

    if (signInMethods.length > 0) {
      return {
        isValid: false,
        message: "Email is already registered.",
      };
    }

    // Check if email exists in Firestore
    const userResult = await dispatch(checkUser(email));

    // If email is not found in Firestore, allow registration
    if (!userResult.found) {
      return {
        isValid: true,
        message: "Email is available for registration.",
      };
    }

    // If email exists in Firestore, it's already registered
    return {
      isValid: false,
      message: "Email is already registered.",
    };
  } catch (error) {
    console.log("Email check error:", error);

    // Handle specific Firebase errors and return corresponding message
    switch (error.code) {
      case "auth/invalid-email":
        return {
          isValid: false,
          message: "The email address is badly formatted.",
        };
      case "auth/network-request-failed":
        return {
          isValid: false,
          message: "Network error. Please check your connection.",
        };
      case "auth/too-many-requests":
        return {
          isValid: false,
          message: "Too many requests. Please try again later.",
        };
      case "auth/user-disabled":
        return {
          isValid: false,
          message: "This user account has been disabled.",
        };
      case "auth/operation-not-allowed":
        return {
          isValid: false,
          message: "Operation not allowed. Please contact support.",
        };
      case "auth/app-not-authorized":
        return {
          isValid: false,
          message: "This app is not authorized to use Firebase Authentication.",
        };
      case "auth/quota-exceeded":
        return {
          isValid: false,
          message: "Firebase quota exceeded. Try again later.",
        };
      default:
        return {
          isValid: false,
          message: "Unexpected error: " + error.message,
        };
    }
  }
};

// Action to check if a user exists by email
export const checkUser = (email) => async (dispatch) => {
  try {
    // Start the loading process
    dispatch(setLoading(true));

    // Convert the email to lowercase to handle case-insensitivity
    const emailLowerCase = email.toLowerCase();

    // Query Firestore to find the user by email
    const userSnapshot = await firestore()
      .collection("users") // Ensure this is the correct collection
      .where("email", "==", emailLowerCase) // Correct field name for email
      .get();

    // Log the snapshot to see if it's correct

    // console.log("User snapshot data:", userSnapshot);
    console.log("Number of documents found:", userSnapshot.size);

    dispatch(setLoading(false));

    // If user not found, return found as false
    if (userSnapshot.empty) {
      return { found: false };
    }

    // If user found, return found as true
    return { found: true };
  } catch (error) {
    console.log("Error in checkUser:", error);
    dispatch(setLoading(false));

    // Dispatch error to the store
    dispatch(setError({ code: error.code, message: error.message }));

    // Return found as false if error occurs
    return { found: false };
  }
};


// Action to reset user password after verifying user existence
export const sendPasswordResetEmail = (email) => async (dispatch) => {
  try {
    // Check if the user exists
    const userResult = await dispatch(checkUser(email)); // This calls the checkUser action you already have

    // If the user doesn't exist in Firestore, return a failure message
    if (!userResult.found) {
      return {
        success: false,
        message: 'No user found with this email address.',
      };
    }

    // If user exists, send the password reset email
    await auth().sendPasswordResetEmail(email);

    // Return success message
    return { success: true };
  } catch (error) {
    console.log("Password reset error:", error);

    // Handle specific Firebase errors
    switch (error.code) {
      case "auth/invalid-email":
        return { success: false, message: "Invalid email format." };
      case "auth/network-request-failed":
        return { success: false, message: "Network error. Please check your connection." };
      case "auth/too-many-requests":
        return { success: false, message: "Too many requests. Please try again later." };
      default:
        return { success: false, message: "An unexpected error occurred: " + error.message };
    }
  }
};


// Action to send email verification
export const sendEmailVerification = () => async (dispatch) => {
  try {
    const user = auth().currentUser;
    if (user && !user.emailVerified) {
      await user.sendEmailVerification();
    }
  } catch (error) {
    console.log("Email verification error:", error);
    dispatch(setError({ code: error.code, message: error.message }));
  }
};

// Action to update user profile
export const updateUserProfile =
  (displayName, photoURL) => async (dispatch) => {
    try {
      const user = auth().currentUser;
      if (user) {
        await user.updateProfile({ displayName, photoURL });
        dispatch({
          type: SET_AUTH,
          payload: { ...user, displayName, photoURL },
        });
      }
    } catch (error) {
      console.log("Profile update error:", error);
      dispatch(setError({ code: error.code, message: error.message }));
    }
  };

// Set loading state action
export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

export const setAuth = (user) => ({
  type: SET_AUTH,
  payload: user,
});

export const setlogout = () => ({
  type: LOGOUT,
});
