import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA-n20EKvJNcc9WDe3KXb5XZsoY8oz7FIw",
    authDomain: "crimealert-55797.firebaseapp.com",
    projectId: "crimealert-55797",
    storageBucket: "crimealert-55797.firebasestorage.app",
    messagingSenderId: "606553032997",
    appId: "1:606553032997:web:87a76ed9b5a806fd5bb2cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
