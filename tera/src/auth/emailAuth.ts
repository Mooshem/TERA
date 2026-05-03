import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import { auth } from "../firebase";

// SIGN UP
export async function signUp(email: string, password: string) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

// LOGIN
export async function login(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

// LOGOUT
export async function logout() {
  return await signOut(auth);
}