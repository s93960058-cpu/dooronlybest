import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCj6XIcfRgFYS7CaJPTkSv1C0j7M_6fRDI",
  authDomain: "python-001-6922e.firebaseapp.com",
  projectId: "python-001-6922e",
  storageBucket: "python-001-6922e.firebasestorage.app",
  messagingSenderId: "1096930279606",
  appId: "1:1096930279606:web:4c459f6ba9d035ee876617"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);