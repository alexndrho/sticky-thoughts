import { FirebaseOptions } from "firebase/app";

export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_VITE_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_VITE_FIREBASE_APP_ID,
};
