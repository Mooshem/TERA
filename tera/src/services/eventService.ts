import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import { db, auth } from "../firebase";
import { addPoints } from "./gamificationService";

/**
 * CREATE EVENT (ONLY VERIFIED USERS)
 */
export async function createEvent({
  title,
  location,
  pointsReward = 10,
  photoURL = "",
}: {
  title: string;
  location: string;
  pointsReward?: number;
  photoURL?: string;
}) {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return;

  const userData = userSnap.data();

  // 🔒 BLOCK UNVERIFIED USERS
  if (!userData.verified) {
    throw new Error("User is not verified to create events");
  }

  await addDoc(collection(db, "events"), {
    title,
    location,
    date: serverTimestamp(),
    createdBy: user.uid,
    createdByUsername: userData.username,
    pointsReward,
    photoURL,
    attendees: [],
  });
}

/**
 * JOIN EVENT + AWARD POINTS
 */
export async function joinEvent(eventId: string) {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "events", eventId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const event = snap.data();

  await updateDoc(ref, {
    attendees: arrayUnion(user.uid),
  });

  await addPoints(user.uid, event.pointsReward || 10);
}

/**
 * REAL-TIME EVENTS STREAM
 */
export function listenToEvents(callback: (data: any[]) => void) {
  const q = query(collection(db, "events"), orderBy("date", "desc"));

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(data);
  });
}