// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { firestore } from './firebase/firebase.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHSA570U5Uo7SRQ256Us-2PxCDdwgXWFM",
  authDomain: "medifind-c1973.firebaseapp.com",
  projectId: "medifind-c1973",
  storageBucket: "medifind-c1973.firebasestorage.app",
  messagingSenderId: "316330482055",
  appId: "1:316330482055:web:ffcfe54cb395d243fd1b22",
  measurementId: "G-4ZJS4TJ5XT"
};

const getData = async() => {
  const data = await firestore.collection('users').get();
  data.forEach(doc => {
    console.log(data.docs.map(doc => doc.data()));
  });
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);