import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";

/* =========================
   LISTEN TO EVENTS (FIX)
========================= */
export function listenToEvents(setEvents: (events: any[]) => void) {
  const ref = collection(db, "events");

  return onSnapshot(ref, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setEvents(data);
  });
}

/* =========================
   JOIN EVENT (YOUR CODE)
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

  const user = {
    userId: firebaseUser.uid,
    username: userData.username,
  };

  const eventRef = doc(db, "events", eventId);

  await updateDoc(eventRef, {
    attendees: arrayUnion(user),
  });
}

/* =========================
   GET SINGLE EVENT (needed for detail page)
========================= */
export async function getEventById(id: string) {
  const ref = doc(db, "events", id);
  const snap = await getDoc(ref);

  return { id: snap.id, ...snap.data() };
}