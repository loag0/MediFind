// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";  

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string; // Optional, as it may not always be used
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyCHSA570U5Uo7SRQ256Us-2PxCDdwgXWFM",
  authDomain: "medifind-c1973.firebaseapp.com",
  projectId: "medifind-c1973",
  storageBucket: "medifind-c1973.firebasestorage.app",
  messagingSenderId: "316330482055",
  appId: "1:316330482055:web:ffcfe54cb395d243fd1b22",
  measurementId: "G-4ZJS4TJ5XT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };