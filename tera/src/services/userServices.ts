import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// CREATE USER IF FIRST LOGIN
export async function createUserIfNotExists(user: any) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      points: 0,
      badges: [],
      createdAt: new Date(),
    });
  }
}

// GET USER PROFILE
export async function getUser(uid: string) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  return snap.exists() ? snap.data() : null;
}

// ADD POINTS (for TERA gamification)
export async function addPoints(uid: string, amount: number) {
  const ref = doc(db, "users", uid);

  await updateDoc(ref, {
    points: amount, // (later we can increment properly)
  });
}