import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  arrayUnion,
} from "firebase/firestore";

import { db, auth } from "../firebase";

/* =========================
   CREATE EVENT
========================= */
export async function createEvent(event: any) {
  const user = auth.currentUser;

  if (!user) {
    console.log("No logged-in user");
    return;
  }

  await addDoc(collection(db, "events"), {
    ...event,
    createdBy: user.uid,
    attendees: [],
    completed: false,
    createdAt: new Date(),
  });
}

/* =========================
   LISTEN TO ALL EVENTS
========================= */
export function listenToEvents(setEvents: (events: any[]) => void) {
  const unsub = onSnapshot(collection(db, "events"), (snapshot) => {
    const data = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      // hide completed events from explore
      .filter((e: any) => !e.completed);

    setEvents(data);
  });

  return unsub;
}

/* =========================
   GET SINGLE EVENT (FIX)
========================= */
export async function getEventById(eventId: string) {
  const ref = doc(db, "events", eventId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    console.log("Event not found");
    return null;
  }

  return {
    id: snap.id,
    ...snap.data(),
  };
}

/* =========================
   JOIN EVENT
========================= */
export async function joinEvent(eventId: string) {
  const firebaseUser = auth.currentUser;

  if (!firebaseUser) {
    console.log("No logged-in user");
    return;
  }

  const userRef = doc(db, "users", firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    console.log("User profile not found");
    return;
  }

  const userData = userSnap.data();

  const attendee = {
    userId: firebaseUser.uid,
    username: userData.username,
  };

  const eventRef = doc(db, "events", eventId);

  await updateDoc(eventRef, {
    attendees: arrayUnion(attendee),
  });
}

/* =========================
   LISTEN TO MANAGED EVENTS
========================= */
export function listenToManagedEvents(
  userId: string,
  setEvents: (events: any[]) => void
) {
  const q = query(collection(db, "events"), where("createdBy", "==", userId));

  const unsub = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setEvents(data);
  });

  return unsub;
}

/* =========================
   COMPLETE EVENT
========================= */
export async function completeEvent(eventId: string) {
  const ref = doc(db, "events", eventId);

  await updateDoc(ref, {
    completed: true,
  });
}

/* =========================
   AWARD POINTS
========================= */
export async function awardPoints(userId: string, points: number) {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const current = snap.data().points || 0;

  await updateDoc(ref, {
    points: current + points,
  });
}