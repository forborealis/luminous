import { getToken, deleteToken } from "firebase/messaging";
import { messaging } from "./firebase";

export const requestFCMToken = async () => {
  try {
    // Ensure notification permissions are granted
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission not granted.");
    }

    // Ensure Service Worker is ready
    const registration = await navigator.serviceWorker.ready;

    // Delete any existing token to force a fresh one
    await deleteToken(messaging);

    // Get a new FCM token
    const token = await getToken(messaging, {
      vapidKey: "BOXS4xCtMCxoxiBO_pqLkeTCmflsk1gQwd94ZNR7MEgRNhoyU6qDBUhC-BMQUll-medvd4IuW4qx6TXFpeOJINc", // Your VAPID key
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      throw new Error("Failed to generate a new FCM token.");
    }

    console.log("Generated new FCM token:", token);
    return token;
  } catch (error) {
    console.error("Error fetching FCM token:", error);
    throw error;
  }
};