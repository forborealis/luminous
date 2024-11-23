// Import Firebase libraries using importScripts
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js");

console.log("[firebase-messaging-sw.js] Service Worker is loading...");

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
;

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
