# MediFind Mobile App

This is the React Native mobile app built using Expo. It allows users to search for doctors, view profiles and book appointments. Authentication supports email/password and guest access.

## 🧠 Stack

- React Native + Expo
- Firebase Auth & Firestore
- Expo Router for navigation
- Expo Auth Session for OAuth

## 🔧 Setup

1. Install dependencies:
- cd mobile
- npm install

2. Run the app: 
- npm run start

3. Open in:
- Android: press `a`
- iOS: press `i`
- Web: press `w`

## 🔐 Firebase

Create a `firebase.js` file under `/mobile/app/` with your config:

```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = { /* your config */ };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

```
---
### All routing is handled via `app/_layout.tsx` using Expo Router 

## 👨‍⚕️ Features
- ✅ Register / login (Email, Google)
- 👤 Guest mode support
- 🔍 View & search doctors by name, specialty, or city
- 🗺️ Google Maps integration to view doctors nearby
- 📅 Book appointments
- 🕐 Working hours availability status
- 🧑 View + edit profile

## 🔐 Auth Notes
- User info (name, phone, email) autofills booking form if logged in
- The book button in the doctor's details is unusable unless logged in

## 🧪 Extras
- Smooth loading states
- Real-time doctor suspension sync
- City field shows in both cards & search filters