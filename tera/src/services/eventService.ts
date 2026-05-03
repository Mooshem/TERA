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
  Timestamp,
} from "firebase/firestore";

import { db, auth } from "../firebase";
import { addPoints } from "./gamificationService";

/**
 * 🌱 CREATE EVENT (VERIFIED USERS ONLY)
 */
export async function createEvent({
  title,
  location,
  date, // ISO string
  pointsReward,
  photoURL,
}: {
  title: string;
  location: string;
  date: string;
  pointsReward: number;
  photoURL: string;
}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User profile not found");
  }

  const userData = userSnap.data();

  // 🔒 ONLY VERIFIED USERS CAN CREATE EVENTS
  if (!userData.verified) {
    throw new Error("User is not verified to create events");
  }

  await addDoc(collection(db, "events"), {
    title,
    location,
    date: Timestamp.fromDate(new Date(date)),
    createdBy: user.uid,
    createdByUsername: userData.username,
    pointsReward: Number(pointsReward) || 10,
    photoURL: photoURL || "",
    attendees: [],
    createdAt: serverTimestamp(),
  });
}

/**
 * 👥 JOIN EVENT + AWARD POINTS
 */
export async function joinEvent(eventId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const eventRef = doc(db, "events", eventId);
  const eventSnap = await getDoc(eventRef);

  if (!eventSnap.exists()) {
    throw new Error("Event not found");
  }

  const event = eventSnap.data();

  // add user to attendees
  await updateDoc(eventRef, {
    attendees: arrayUnion(user.uid),
  });

  // award points
  await addPoints(user.uid, event.pointsReward || 10);
}

/**
 * 📡 REAL-TIME EVENTS STREAM
 */
export function listenToEvents(callback: (events: any[]) => void) {
  const q = query(collection(db, "events"), orderBy("date", "desc"));

  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(events);
  });
}