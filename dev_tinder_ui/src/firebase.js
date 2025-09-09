// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyB8LwdgggSaHqFPQEnCJJjKUhuoFHmSWxg",
  authDomain: "dev-match-platform.firebaseapp.com",
  projectId: "dev-match-platform",
  storageBucket: "dev-match-platform.firebasestorage.app",
  messagingSenderId: "295874152417",
  appId: "1:295874152417:web:9163a31b7a6ac7f32db4a0",
  measurementId: "G-7YRNB38S89",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;
