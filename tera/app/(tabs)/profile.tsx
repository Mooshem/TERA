import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useUserProfile } from "../../src/hooks/useUserProfile";
import { calculateLevel, levelProgress } from "../../src/utils/levelSystem";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

type Task = {
  id: string;
  title: string;
  points: number;
};

const TASK_POOL: Task[] = [
  { id: "1", title: "Pick up 5 pieces of trash", points: 10 },
  { id: "2", title: "Recycle 3 items", points: 8 },
  { id: "3", title: "Clean a small outdoor area", points: 15 },
  { id: "4", title: "Use reusable container today", points: 5 },
  { id: "5", title: "Join a cleanup event", points: 20 },
];

export default function Profile() {
  const { profile } = useUserProfile();
  const router = useRouter();

  const [points, setPoints] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeLeft, setTimeLeft] = useState("");

  const isVerified = profile?.verified === true;

  // Load points from profile
  useEffect(() => {
    if (profile) setPoints(profile.points || 0);
  }, [profile]);

  // Daily tasks
  useEffect(() => {
    const shuffled = [...TASK_POOL].sort(() => 0.5 - Math.random());
    setTasks(shuffled.slice(0, 3));
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);

      const diff = midnight.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const completeTask = (task: Task) => {
    setPoints((prev) => prev + task.points);
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  };

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  const level = calculateLevel(points);
  const progress = levelProgress(points);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.username}>{profile.username}</Text>
        <Text style={styles.level}>
          Level {level} {isVerified ? "🟢 Verified" : "⚪"}
        </Text>
      </View>

      {/* PROGRESS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Progress</Text>

        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.max(0, Math.min(progress * 100, 100))}%` },
            ]}
          />
        </View>

        <Text style={styles.points}>🌱 {points} points</Text>
      </View>

      {/* DAILY TASKS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Tasks</Text>
        <Text style={styles.timer}>⏳ Refresh in {timeLeft}</Text>

        {tasks.length === 0 ? (
          <Text style={styles.empty}>All tasks completed today</Text>
        ) : (
          tasks.map((task) => (
            <View key={task.id} style={styles.taskRow}>
              <View>
                <Text style={styles.taskText}>{task.title}</Text>
                <Text style={styles.taskPoints}>+{task.points} pts</Text>
              </View>

              <TouchableOpacity
                style={styles.checkButton}
                onPress={() => completeTask(task)}
              >
                <Text style={styles.checkText}>✔</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* STATS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Stats</Text>
        <Text style={styles.stat}>
          🔥 Streak: {profile.streak?.current || 0} days
        </Text>
      </View>

      {/* BADGES */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Badges</Text>

        <View style={styles.badgeContainer}>
          {(profile.badges || []).length === 0 ? (
            <Text style={styles.empty}>No badges yet</Text>
          ) : (
            profile.badges.map((b: string) => (
              <View key={b} style={styles.badge}>
                <Text style={styles.badgeText}>🏅 {b}</Text>
              </View>
            ))
          )}
        </View>
      </View>

      {/* 🌍 CREATE EVENT BUTTON */}
      {isVerified && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Creator Tools</Text>

          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push("/create")}
          >
            <Text style={styles.createButtonText}>
              🌍 Create Cleanup Event
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const GREEN = "#2e7d32";
const LIGHT_GREEN = "#e8f5e9";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f7f4",
    gap: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loading: {
    fontSize: 16,
    color: "#666",
  },

  header: {
    marginBottom: 10,
  },

  username: {
    fontSize: 30,
    fontWeight: "bold",
    color: GREEN,
  },

  level: {
    fontSize: 18,
    color: "#555",
  },

  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: GREEN,
  },

  progressBarBackground: {
    height: 12,
    backgroundColor: "#ddd",
    borderRadius: 6,
    overflow: "hidden",
  },

  progressBarFill: {
    height: 12,
    backgroundColor: GREEN,
  },

  points: {
    marginTop: 8,
  },

  timer: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },

  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  taskText: {
    fontSize: 14,
  },

  taskPoints: {
    fontSize: 12,
    color: "#777",
  },

  checkButton: {
    backgroundColor: GREEN,
    borderRadius: 20,
    padding: 8,
  },

  checkText: {
    color: "white",
    fontWeight: "bold",
  },

  stat: {
    fontSize: 16,
  },

  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  badge: {
    backgroundColor: LIGHT_GREEN,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  badgeText: {
    color: GREEN,
  },

  empty: {
    color: "#777",
  },

  createButton: {
    backgroundColor: GREEN,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  createButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});