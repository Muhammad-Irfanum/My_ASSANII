// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDwlIgA4492ivT20WLypD0mUVMlSeynieU",
  authDomain: "aasani-fe829.firebaseapp.com",
  projectId: "aasani-fe829",
  storageBucket: "aasani-fe829.firebasestorage.app",
  messagingSenderId: "246316190471",
  appId: "1:246316190471:web:dc3c636fc8523c580053a2",
  measurementId: "G-Y0BS4RMWTB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);