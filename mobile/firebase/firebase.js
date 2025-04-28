// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";  

const firebaseConfig = {
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
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);

export { app, auth, db };