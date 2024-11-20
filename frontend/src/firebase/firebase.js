// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDixaGAYlsbI1fxSaT4kxL6DtlSdcFyNkM",
  authDomain: "database512.firebaseapp.com",
  projectId: "database512",
  storageBucket: "database512.firebasestorage.app",
  messagingSenderId: "961173587953",
  appId: "1:961173587953:web:d5357d582b7eaf74816650",
  measurementId: "G-C46R3WC8D8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Firebase Authentication

export { auth }; // Export the auth instance for use in other files
