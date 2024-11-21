// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Import Firebase Auth
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_zT_bVnHA4diGg3c17gEvcSHpyKykI74",
  authDomain: "luminous-c7752.firebaseapp.com",
  projectId: "luminous-c7752",
  storageBucket: "luminous-c7752.firebasestorage.app",
  messagingSenderId: "530204624953",
  appId: "1:530204624953:web:29b5125504b4f68d42e5e8",
  measurementId: "G-F3KY0NN8WY"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Firebase Authentication
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider }; // Export the auth instance for use in other files
