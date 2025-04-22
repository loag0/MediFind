import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCHSA570U5Uo7SRQ256Us-2PxCDdwgXWFM",
  authDomain: "medifind-c1973.firebaseapp.com",
  projectId: "medifind-c1973",
  storageBucket: "medifind-c1973.firebasestorage.app",
  messagingSenderId: "316330482055",
  appId: "1:316330482055:web:ffcfe54cb395d243fd1b22",
  measurementId: "G-4ZJS4TJ5XT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
