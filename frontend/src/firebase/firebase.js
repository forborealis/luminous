import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDixaGAYlsbI1fxSaT4kxL6DtlSdcFyNkM",
  authDomain: "database512.firebaseapp.com",
  projectId: "database512",
  storageBucket: "database512.firebasestorage.app",
  messagingSenderId: "961173587953",
  appId: "1:961173587953:web:d5357d582b7eaf74816650",
  measurementId: "G-C46R3WC8D8",
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
