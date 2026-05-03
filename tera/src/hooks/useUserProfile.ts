import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

export type UserProfile = {
  username: string;
  email: string;
  points: number;
  badges: string[];
  verified: boolean;
  streak: {
    current: number;
  };
  createdAt?: any;
};

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const ref = doc(db, "users", user.uid);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();

          setProfile({
            username: data.username ?? "",
            email: data.email ?? "",
            points: data.points ?? 0,
            badges: data.badges ?? [],
            verified: data.verified ?? false,
            streak: data.streak ?? { current: 0 },
            createdAt: data.createdAt ?? null,
          });
        } else {
          setProfile(null);
        }

        setLoading(false);
      },
      (error) => {
        console.error("Error fetching user profile:", error);
        setProfile(null);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  return { profile, loading };
}