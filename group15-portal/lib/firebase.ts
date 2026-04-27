import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";

function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

function getFirebaseApp(): FirebaseApp {
  const config = getFirebaseConfig();
  if (!config.apiKey || !config.projectId) {
    throw new Error(
      "Missing Firebase configuration. Add NEXT_PUBLIC_FIREBASE_* variables to .env.local (see .env.example)."
    );
  }
  return getApps().length === 0 ? initializeApp(config) : getApp();
}

export const app = getFirebaseApp();
