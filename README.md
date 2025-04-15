<div align="center">
  <h1>🩺 MediFind</h1>
  <p><strong>Doctor Discovery & Booking App — Mobile App (Expo) + Web Admin Dashboard</strong></p>

  <img src="https://img.shields.io/badge/React%20Native-Mobile%20App-blue?logo=react" />
  <img src="https://img.shields.io/badge/React-Web%20Dashboard-blue?logo=react" />
  <img src="https://img.shields.io/badge/Firebase-Backend-yellow?logo=firebase" />
  <img src="https://img.shields.io/badge/Expo-Cross--Platform-9cf?logo=expo" />
  <img src="https://img.shields.io/badge/Tailwind-Styling-38bdf8?logo=tailwindcss" />

  <br/><br/>
  <!-- Replace the image below with a real screenshot or hosted banner -->
  <img src="https://github.com/YOUR_USERNAME/medifind/assets/preview.png" width="700" alt="MediFind app preview"/>

  <br/>
  <a href="#📱-mobile-app">📱 Mobile App</a> •
  <a href="#💻-web-admin">💻 Web Admin</a> •
  <a href="#🔧-tech-stack">🔧 Tech Stack</a> •
  <a href="#🚀-setup">🚀 Setup</a>
</div>

---

## 🌍 Overview

**MediFind** is a full-stack healthcare platform where users can:

- 🔍 Discover doctors based on location and specialty
- 📄 View contact details and doctor profiles
- 📅 Book appointments through a clean mobile UI
- 🧑‍💻 Admins can log in on the web, add/edit doctors, and generate reports

Real-time data syncing is handled via Firebase so the mobile and web apps stay connected.

## 🔧 Tech Stack

| Platform      | Tools Used                                  |
|---------------|---------------------------------------------|
| Mobile App    | React Native (Expo), Firebase, Expo Router |
| Web Dashboard | React (Vite), Firebase, Tailwind CSS, React Router |
| Backend       | Firebase Auth, Firestore DB                 |

## 📁 Project Structure
/MediFind ├── /mobile → Expo mobile app ├── /web → React web admin dashboard

## Each folder contains its own README with install + dev instructions.

- See `/mobile/README.md` for mobile app setup
- See `/web/README.md` for admin web dashboard setup

## 🚀 Setup

### 🧪 Prerequisites
- Node.js installed
- Firebase project created

### 📱 Mobile App Setup (Expo)
```bash
cd mobile
npm install
npm run start
```
### Then press: 
- `a` to open Android
- `i` to open iOS
- `w` for web view

### Your Firebase config should live in: 
- `/mobile/app/firebase.js`

## 💻 Web App Setup (Vite or CRA)
```bash
cd web
npm install
npm run dev   # or npm start if using CRA
```
### Your Firebase config should live in: 
- `/web/src/firebase/config.js`

## 👨‍⚕️ Features
### Mobile
- Register / login (Email, Google, Facebook)
- View and search doctor profiles
- Book appointments
- View + edit profile
- Guest mode support

### Web Admin
- Login (Username + Password)
- Add / edit doctors
- View dashboard stats
- Generate reports