import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TEMP placeholder config (replace later with real values)
const firebaseConfig = {
  apiKey: "AIzaSyCA4w0iw5g2-Xl-cpvWWULXU2H5OEZWBPQ",
  authDomain: "tera-7141f.firebaseapp.com",
  projectId: "tera-7141f",
  storageBucket: "tera-7141f.firebasestorage.app",
  messagingSenderId: "454331929912",
  appId: "1:454331929912:web:c47c84daa1f4a442861dcd",
  measurementId: "G-5M8VM42QTW"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);