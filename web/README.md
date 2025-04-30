# 🩺 MediFind – Web Admin Portal

Welcome to the **MediFind Admin Dashboard**, the control center of your medical directory app. Here, the admin can log in, manage doctors, upload profile pictures, suspend accounts, and generate clean printable reports.

This is **not** for users. This is the **backend admin panel**. All the data flows from here to the mobile app.

---

## 🧠 Features

- 🔐 Email/password admin login (Firebase Auth)
- 🧑‍⚕️ Add / Edit / Delete doctor profiles
- ⛔ Suspend / Unsuspend doctors
- 🕒 Set working hours separately from suspension
- 🖼️ Upload profile pics (via Cloudinary)
- 📄 Generate clean printable reports
- 🚫 Suspended doctors don't show up on mobile
- ⚛️ Built with React, Vite, Firebase, and Cloudinary

---

## 🛠️ Tech Stack

- ⚛️ **React + TypeScript**
- ⚡ **Vite** for blazing fast development
- 📁 **CSS Modules** (separate `.css` files, no Tailwind)
- 🔥 **Firebase** (Auth + Firestore)
- 🌩️ **Cloudinary** for doctor profile pictures

---

## ⚙️ Setup Guide

> Make sure you're inside the `web/` folder.

### 1. Install dependencies

```bash
npm install
```
### Setup Firebase
Create a file at `src/firebase/config.js` with your Firebase web config

``` js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_APP.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  // ... other keys
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
```
### Setup Cloudinary
Go to your Cloudinary Dashboard and:
- Create an unsigned upload preset (Settings > Upload > Upload Presets)
-Enable unsigned uploading
- Add these constants in your AddDoctor and EditDoctor components:

``` ts
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'medifind_unsigned';
```
### Start the dev server
```bash
npm run dev
```

## 🧑‍💻Admin Auth & Roles
- Admin logs in with email + password (Firebase Auth)
-Manually create admin in Firebase Authentication console
-Each user in Firestore has a `role` field (either `"admin"` or `"user"`)
-When someone signs up from the mobile app, their role is auto-set to `"user"`

## 🗒️Firestore Doctor Fields
To keep things consistent across mobile and web, here are the fields every doctor doc should have:
``` json
{
  "fullName": "Dr. John Doe",
  "email": "john@clinic.com",
  "profession": "Cardiologist",
  "gender": "Male",
  "phone": "+123456789",
  "fax": "123-4567",
  "City": "Gaborone",
  "bio": "Experienced with over 10 years...",
  "profileImageUrl": "https://cloudinary.com/...jpg",
  "isSuspended": false,
  "createdAt": Timestamp,
  "workingHours": {
    "start": "08:00",
    "end": "16:00"
  }
}
```
---

## 🖨️ Print-Friendly Reports
Each doctor has a printable report page. When you click "Generate Report", you’ll be taken to a report view.

✅ Click the "Print Report" button and only the report content gets printed — no nav, no fluff.

## 🧪 Extras
- Protected routes via role-based login
- Nav bar with logo + "Add Doctor" + user settings
- Image editing/removal works even after initial upload
- Dynamic form layout (image controls shift layout down)
- Suspended doctor cards have a grey overlay with “SUSPENDED”

## 🤝 License
School project. Academic flex. Not for production use unless you’re trying to hire me 😁.

