import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { firebaseConfig } from "@/config/firebase";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// References
const thoughtsCollectionRef = collection(db, "thoughts");

export { db, thoughtsCollectionRef };
