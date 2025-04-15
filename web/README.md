# MediFind Admin Web App

This is the web-based admin dashboard for MediFind. Admins can log in, add/edit doctors, and view reports.

## 🧠 Stack

- React (Vite or Create React App)
- Firebase Auth & Firestore
- Tailwind CSS
- React Router

## 🔧 Setup

1. Install dependencies:
- cd web
- npm install

2. Run the dev server:
- npm run dev //If using Vite

### OR

- npm start //If using CRA

## 🔐 Firebase

Create `src/firebase/config.js` with your Firebase config:

```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = { /* your config */ };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```
## 👨‍⚕️ Features
- Login (Username + Password)
- Add / edit doctors
- View dashboard stats
- Generate reports