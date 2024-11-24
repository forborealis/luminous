import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";


// Firebase configuration
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
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const messaging = getMessaging(app);

// Register the Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered successfully:", registration);
      // No need for useServiceWorker. The Service Worker will automatically handle messaging.
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

// Handle foreground messages
onMessage(messaging, (payload) => {
  console.log("Message received in the foreground:", payload);
  // Show notification or update UI based on payload
});

// Export Firebase services
export { auth, googleProvider, messaging };
