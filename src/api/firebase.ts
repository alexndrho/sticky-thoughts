import { initializeApp } from 'firebase/app';
import { collection, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyABVlYKR1fRHwH9z5q3lUphmmsa_po6Xw4',
  authDomain: 'sticky-thoughts-e7078.firebaseapp.com',
  projectId: 'sticky-thoughts-e7078',
  storageBucket: 'sticky-thoughts-e7078.appspot.com',
  messagingSenderId: '446172173287',
  appId: '1:446172173287:web:7936421b190eb0415a2342',
  measurementId: 'G-W6QRFPEC18',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// References
const thoughtsCollectionRef = collection(db, 'thoughts');

export { db, thoughtsCollectionRef };
