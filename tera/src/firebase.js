import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TEMP placeholder config (replace later with real values)
const firebaseConfig = {
  apiKey: "demo",
  authDomain: "demo",
  projectId: "demo",
  storageBucket: "demo",
  messagingSenderId: "demo",
  appId: "demo",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);