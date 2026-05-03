import { doc, updateDoc, increment, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Add points safely (central logic)
 */
export async function addPoints(userId: string, amount: number) {
  const ref = doc(db, "users", userId);

  await updateDoc(ref, {
    points: increment(amount),
  });

  await checkBadges(userId);
}


export async function checkBadges(userId: string) {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();
  const points = data.points || 0;
  const badges = data.badges || [];

  const newBadges: string[] = [];

  if (points >= 10 && !badges.includes("beginner")) {
    newBadges.push("beginner");
  }

  if (points >= 50 && !badges.includes("active")) {
    newBadges.push("active");
  }

  if (points >= 100 && !badges.includes("leader")) {
    newBadges.push("leader");
  }

  if (newBadges.length > 0) {
    await updateDoc(ref, {
      badges: arrayUnion(...newBadges),
    });
  }
}