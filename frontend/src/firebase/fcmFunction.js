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
      vapidKey: "BBylJMkId-DQZfdHtrSPrdgsG0G8txKHrjtgjsYBLiKMvgKiXLB5qUn6hBlhhGrdF1b7Td6grwG-5JhFujc9Eho", // Your VAPID key
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