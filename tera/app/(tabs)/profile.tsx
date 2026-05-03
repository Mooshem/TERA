import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { Href, useRouter } from "expo-router";
import { AppCard } from "@/src/ui/components/AppCard";
import { CelebrationBurst } from "@/src/ui/components/CelebrationBurst";
import { PixelNatureBackdrop } from "@/src/ui/components/PixelNatureBackdrop";
import { PixelIcon } from "@/src/ui/components/PixelIcon";
import { ui } from "@/src/ui/theme";
import { useUserProfile } from "../../src/hooks/useUserProfile";
import { calculateLevel, levelProgress } from "../../src/utils/levelSystem";
import { awardPoints, completeEvent, listenToManagedEvents } from "../../src/services/eventService";
import { auth } from "../../src/firebase";

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
  const router = useRouter();
  const { profile } = useUserProfile();
  const [points, setPoints] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeLeft, setTimeLeft] = useState("");
  const [managedEvents, setManagedEvents] = useState<any[]>([]);
  const [burstCounter, setBurstCounter] = useState(0);
  const [burstText, setBurstText] = useState("");
  const chipPulse = useState(new Animated.Value(1))[0];

  const isVerified = profile?.verified === true;

  useEffect(() => {
    if (profile) setPoints(profile.points || 0);
  }, [profile]);

  useEffect(() => {
    const shuffled = [...TASK_POOL].sort(() => 0.5 - Math.random());
    setTasks(shuffled.slice(0, 3));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const unsub = listenToManagedEvents(uid, setManagedEvents);
    return unsub;
  }, []);

  const playPulse = () => {
    Animated.sequence([
      Animated.spring(chipPulse, {
        toValue: 1.08,
        useNativeDriver: true,
        friction: 4,
        tension: 100,
      }),
      Animated.spring(chipPulse, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 90,
      }),
    ]).start();
  };

  const completeTask = (task: Task) => {
    setPoints((prev) => prev + task.points);
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    setBurstText(`+${task.points} XP`);
    setBurstCounter((prev) => prev + 1);
    playPulse();
  };

  const handleAwardPoints = async (userId: string, points: number, username: string) => {
    try {
      await awardPoints(userId, points);
      setBurstText(`Awarded ${points} points to ${username}!`);
      setBurstCounter((prev) => prev + 1);
      playPulse();
    } catch (error) {
      console.error("Error awarding points:", error);
      setBurstText("Error awarding points!");
      setBurstCounter((prev) => prev + 1);
    }
  };

  const handleCompleteEvent = async (eventId: string) => {
    await completeEvent(eventId);
    setBurstText("Event completed!");
    setBurstCounter((prev) => prev + 1);
  };

  if (!profile) {
    return (
      <View style={styles.center}>
        <PixelNatureBackdrop opacity={0.4} />
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  const level = calculateLevel(points);
  const progress = levelProgress(points);

  return (
    <View style={styles.screen}>
      <PixelNatureBackdrop />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.kicker}>PLAYER PROFILE</Text>
          <Text style={styles.username}>{profile.username}</Text>
          <Animated.View style={[styles.metaChips, { transform: [{ scale: chipPulse }] }]}>
            <View style={styles.metaChip}>
              <PixelIcon type="leaf" size={16} color="#7cb342" animated={true} />
              <Text style={styles.metaChipText}> {points} XP</Text>
            </View>
            <View style={styles.metaChip}>
              <PixelIcon type="fire" size={16} color="#ff6b35" />
              <Text style={styles.metaChipText}> {profile?.streak?.current || 0} streak</Text>
            </View>
            <View style={styles.metaChip}>
              <PixelIcon type="star" size={16} color="#ffd700" />
              <Text style={styles.metaChipText}> Lv {level}</Text>
            </View>
          </Animated.View>
          <View style={styles.badgeRow}>
            {(profile.badges || []).length === 0 ? (
              <Text style={styles.noBadges}>Unlock badges by completing actions!</Text>
            ) : (
              profile.badges.map((b: string) => (
                <View key={b} style={styles.badge}>
                  <View style={styles.badgeContent}>
                    <PixelIcon type="badge" size={12} color="#daa520" />
                    <Text style={styles.badgeText}> {b}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        <CelebrationBurst triggerKey={burstCounter} message={burstText} />

        <AppCard style={styles.card}>
          <Text style={styles.cardTitle}>XP Progress</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${Math.max(6, progress * 100)}%` }]} />
          </View>
          <Text style={styles.points}>{Math.round(progress * 100)}% to next level</Text>
        </AppCard>

        <AppCard style={styles.card}>
          <Text style={styles.cardTitle}>Daily Quests</Text>
          <Text style={styles.timer}>⏳ Refresh in {timeLeft}</Text>
          {tasks.length === 0 ? (
            <Text style={styles.empty}>All quests completed. Great run today!</Text>
          ) : (
            tasks.map((task) => (
              <View key={task.id} style={styles.taskRow}>
                <View style={styles.taskCopyWrap}>
                  <Text style={styles.taskText}>{task.title}</Text>
                  <Text style={styles.taskPoints}>Reward: +{task.points} XP</Text>
                </View>
                <TouchableOpacity style={styles.questButton} onPress={() => completeTask(task)}>
                  <Text style={styles.questButtonText}>Claim</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </AppCard>

        {isVerified && (
          <AppCard style={styles.card}>
            <Text style={styles.cardTitle}>Creator Tools</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push("/create" as Href)}
            >
              <View style={styles.createButtonContent}>
                <PixelIcon type="globe" size={16} color="#4a7c59" />
                <Text style={styles.createButtonText}> Create Cleanup Event</Text>
              </View>
            </TouchableOpacity>
          </AppCard>
        )}

        {isVerified && (
          <AppCard style={styles.card}>
            <Text style={styles.cardTitle}>Managed Events</Text>
            {managedEvents.length === 0 ? (
              <Text style={styles.empty}>You haven&apos;t created any events yet</Text>
            ) : (
              managedEvents.map((event) => (
                <View key={event.id} style={styles.eventCard}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventMeta}>👥 {event.attendees?.length || 0} attending</Text>

                  {(event.attendees || []).map((user: any) => (
                    <View key={user.userId} style={styles.attendeeRow}>
                      <Text style={styles.attendeeName}>{user.username}</Text>
                      <View style={styles.buttonGroup}>
                        <TouchableOpacity
                          style={({ pressed }) => [
                            styles.fullButton,
                            pressed && styles.fullButtonPressed
                          ]}
                          onPress={() => handleAwardPoints(user.userId, event.pointsReward, user.username)}
                        >
                          <Text style={styles.buttonText}>Full</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={({ pressed }) => [
                            styles.halfButton,
                            pressed && styles.halfButtonPressed
                          ]}
                          onPress={() => handleAwardPoints(user.userId, Math.floor(event.pointsReward / 2), user.username)}
                        >
                          <Text style={styles.buttonText}>Half</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}

                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => handleCompleteEvent(event.id)}
                  >
                    <Text style={styles.completeText}>Mark Event Complete</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </AppCard>
        )}
      </ScrollView>
    </View>
  );
}

const GREEN = ui.colors.primary;
const LIGHT_GREEN = ui.colors.primarySoft;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: ui.colors.background,
  },
  container: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ui.colors.background,
  },
  loading: {
    color: ui.colors.textMuted,
  },
  header: {
    marginBottom: 4,
  },
  kicker: {
    color: ui.colors.primaryDark,
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: "700",
  },
  username: {
    fontSize: 28,
    fontWeight: "bold",
    color: ui.colors.text,
    marginTop: 2,
  },
  metaChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  metaChip: {
    backgroundColor: "#e6f5e9",
    borderRadius: ui.radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: "#c7dccb",
    flexDirection: "row",
    alignItems: "center",
  },
  metaChipText: {
    color: ui.colors.primaryDark,
    fontSize: 12,
    fontWeight: "700",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  badge: {
    backgroundColor: LIGHT_GREEN,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#cfe5d0",
  },
  badgeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeText: {
    color: GREEN,
    fontSize: 11,
    fontWeight: "600",
  },
  noBadges: {
    fontSize: 12,
    color: ui.colors.textMuted,
  },
  card: {
    gap: 8,
    backgroundColor: "rgba(247,251,247,0.94)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: GREEN,
  },
  barBg: {
    height: 12,
    backgroundColor: "#d9e4da",
    borderRadius: 6,
    overflow: "hidden",
  },
  barFill: {
    height: 12,
    backgroundColor: GREEN,
  },
  points: {
    color: ui.colors.textMuted,
    fontSize: 12,
  },
  timer: {
    fontSize: 12,
    color: ui.colors.textMuted,
  },
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
    paddingVertical: 2,
  },
  taskCopyWrap: {
    flex: 1,
    gap: 2,
  },
  taskText: {
    fontSize: 14,
    color: ui.colors.text,
    fontWeight: "600",
  },
  taskPoints: {
    fontSize: 12,
    color: ui.colors.textMuted,
  },
  questButton: {
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  questButtonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 12,
  },
  empty: {
    color: ui.colors.textMuted,
  },
  createButton: {
    backgroundColor: GREEN,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  createButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  createButtonText: {
    color: "white",
    fontWeight: "700",
  },
  eventCard: {
    marginTop: 8,
    padding: 14,
    backgroundColor: LIGHT_GREEN,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cfe5d0",
  },
  eventTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: ui.colors.primaryDark,
  },
  eventMeta: {
    fontSize: 12,
    color: "#4f6a56",
    marginBottom: 8,
  },
  attendeeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  attendeeName: {
    fontSize: 14,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
  },
  fullButton: {
    backgroundColor: GREEN,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#2d5a3d",
  },
  fullButtonPressed: {
    backgroundColor: "#2d5a3d",
    transform: [{ scale: 0.95 }],
  },
  halfButton: {
    backgroundColor: "#6cae70",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#5a8d5f",
  },
  halfButtonPressed: {
    backgroundColor: "#5a8d5f",
    transform: [{ scale: 0.95 }],
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  completeButton: {
    marginTop: 10,
    backgroundColor: ui.colors.primaryDark,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  completeText: {
    color: "white",
    fontWeight: "800",
  },
});