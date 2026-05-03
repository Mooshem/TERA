import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "../firebase";

type User = {
  id: string;
  username: string;
  points: number;
};

export function useLeaderboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      orderBy("points", "desc"),
      limit(50)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();

        return {
          id: doc.id,
          username: d.username ?? "Unknown",
          points: d.points ?? 0,
        };
      });

      setUsers(data);
      setLoading(false);
    });

    return unsub;
  }, []);

  return { users, loading };
}