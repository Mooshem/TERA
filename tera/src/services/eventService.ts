import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

import { db, auth } from "../firebase";

function resolveDisplayName(userData: any, firebaseUser: any) {
  const raw = userData?.username;
  if (typeof raw === "string" && raw.trim().length > 0) return raw.trim();

  const email = firebaseUser?.email;
  if (typeof email === "string" && email.includes("@")) {
    return email.split("@")[0];
  }

  return null;
}

function sanitizeAttendees(attendees: any[] | undefined) {
  const source = Array.isArray(attendees) ? attendees : [];
  const seen = new Set<string>();

  return source.filter((attendee) => {
    const userId =
      typeof attendee?.userId === "string" ? attendee.userId.trim() : "";
    const username =
      typeof attendee?.username === "string" ? attendee.username.trim() : "";

    if (!userId || !username) return false;
    if (seen.has(userId)) return false;
    seen.add(userId);
    return true;
  });
}

/* =========================
   CREATE EVENT
========================= */
export async function createEvent(event: any) {
  const user = auth.currentUser;

  if (!user) {
    console.log("No logged-in user");
    return;
  }

  // Get user profile to store username
  const userDoc = await getDoc(doc(db, "users", user.uid));
  const userData = userDoc.data();
  const username = userData?.username || user.email?.split("@")[0] || "Unknown";

  await addDoc(collection(db, "events"), {
    ...event,
    createdBy: user.uid,
    createdByUsername: username,
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
        attendees: sanitizeAttendees(doc.data().attendees),
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
    attendees: sanitizeAttendees(snap.data().attendees),
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
  const username = resolveDisplayName(userData, firebaseUser);

  if (!username) {
    console.log("Cannot join event: user has no valid display name");
    return;
  }

  const attendee = {
    userId: firebaseUser.uid,
    username,
  };

  const eventRef = doc(db, "events", eventId);
  const eventSnap = await getDoc(eventRef);
  if (!eventSnap.exists()) return;

  const existing = sanitizeAttendees(eventSnap.data().attendees);
  const withoutCurrentUser = existing.filter(
    (item: any) => item.userId !== firebaseUser.uid
  );
  const nextAttendees = [...withoutCurrentUser, attendee];

  await updateDoc(eventRef, {
    attendees: nextAttendees,
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
      attendees: sanitizeAttendees(doc.data().attendees),
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