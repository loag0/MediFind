// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { ReactNativeAsyncStorage } from "@react-native-async-storage/async-storage";  
import React from "react";

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
const auth = getAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

export { app, auth, db };