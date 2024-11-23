// Import Firebase libraries using importScripts
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js");

console.log("[firebase-messaging-sw.js] Service Worker is loading...");

// Firebase configuration
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
firebase.initializeApp(firebaseConfig);
console.log("[firebase-messaging-sw.js] Firebase initialized.");

// Initialize Firebase Messaging
const messaging = firebase.messaging();
console.log("[firebase-messaging-sw.js] Firebase Messaging initialized.");

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message:", payload);

  const notificationTitle = payload.notification.title || "Notification";
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png", // Adjust your icon path if needed
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});
