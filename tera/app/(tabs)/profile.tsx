import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
  } from "react-native";
  
  import { useEffect, useState } from "react";
  import { Href, useRouter } from "expo-router";
  import { AppCard } from "@/src/ui/components/AppCard";
  import { ui } from "@/src/ui/theme";
  
  import { useUserProfile } from "../../src/hooks/useUserProfile";
  import { calculateLevel, levelProgress } from "../../src/utils/levelSystem";
  
  import {
    listenToManagedEvents,
    completeEvent,
    awardPoints,
  } from "../../src/services/eventService";
  
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
    const [rewardText, setRewardText] = useState("");
    const chipPulse = useState(new Animated.Value(1))[0];
    const rewardOpacity = useState(new Animated.Value(0))[0];
    const rewardLift = useState(new Animated.Value(0))[0];
  
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
  
    const completeTask = (task: Task) => {
      setPoints((prev) => prev + task.points);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      setRewardText(`+${task.points} XP`);

      rewardOpacity.setValue(0);
      rewardLift.setValue(0);
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

      Animated.parallel([
        Animated.timing(rewardOpacity, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(rewardLift, {
          toValue: -8,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.timing(rewardOpacity, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }).start(() => setRewardText(""));
      });
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
          <Text style={styles.kicker}>TERA PROFILE</Text>
          <Text style={styles.username}>{profile.username}</Text>
          <Animated.View style={[styles.metaChips, { transform: [{ scale: chipPulse }] }]}>
            <Text style={styles.metaChip}>🌱 {points} XP</Text>
            <Text style={styles.metaChip}>🔥 {profile?.streak?.current || 0} streak</Text>
          </Animated.View>
  
          {/* BADGES */}
          <View style={styles.badgeRow}>
            {(profile.badges || []).length === 0 ? (
              <Text style={styles.noBadges}>No badges yet</Text>
            ) : (
              profile.badges.map((b: string) => (
                <View key={b} style={styles.badge}>
                  <Text style={styles.badgeText}>🏅 {b}</Text>
                </View>
              ))
            )}
          </View>
  
          <Text style={styles.level}>
            Level {level} {isVerified ? "• Verified Organizer" : "• Community Member"}
          </Text>
        </View>
  
        {/* PROGRESS */}
        <AppCard style={styles.card}>
          <Text style={styles.cardTitle}>Progress</Text>
  
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
          </View>
  
          <Text style={styles.points}>🌱 {points} pts</Text>
        </AppCard>
  
        {/* DAILY TASKS */}
        <AppCard style={styles.card}>
          <Text style={styles.cardTitle}>Daily Tasks</Text>
          <Text style={styles.timer}>⏳ Refresh in {timeLeft}</Text>
          {rewardText ? (
            <Animated.Text
              style={[
                styles.rewardBurst,
                {
                  opacity: rewardOpacity,
                  transform: [{ translateY: rewardLift }],
                },
              ]}
            >
              {rewardText}
            </Animated.Text>
          ) : null}
  
          {tasks.length === 0 ? (
            <Text style={styles.empty}>All tasks completed</Text>
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
        </AppCard>
  
        {/* CREATOR TOOLS */}
        {isVerified && (
          <AppCard style={styles.card}>
            <Text style={styles.cardTitle}>Creator Tools</Text>
  
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push("/create" as Href)}
            >
              <Text style={styles.createButtonText}>
                🌍 Create Cleanup Event
              </Text>
            </TouchableOpacity>
          </AppCard>
        )}
  
        {/* MANAGED EVENTS */}
        {isVerified && (
          <AppCard style={styles.card}>
            <Text style={styles.cardTitle}>Managed Events</Text>
  
            {managedEvents.length === 0 ? (
              <Text style={styles.empty}>
                You haven't created any events yet
              </Text>
            ) : (
              managedEvents.map((event) => (
                <View key={event.id} style={styles.eventCard}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
  
                  <Text style={styles.eventMeta}>
                    👥 {event.attendees?.length || 0} attending
                  </Text>
  
                  {(event.attendees || []).map((user: any) => (
                    <View key={user.userId} style={styles.attendeeRow}>
                      <Text style={styles.attendeeName}>
                        {user.username}
                      </Text>
  
                      <View style={styles.buttonGroup}>
                        <TouchableOpacity
                          style={styles.fullButton}
                          onPress={() =>
                            awardPoints(user.userId, event.pointsReward)
                          }
                        >
                          <Text style={styles.buttonText}>Full</Text>
                        </TouchableOpacity>
  
                        <TouchableOpacity
                          style={styles.halfButton}
                          onPress={() =>
                            awardPoints(
                              user.userId,
                              Math.floor(event.pointsReward / 2)
                            )
                          }
                        >
                          <Text style={styles.buttonText}>Half</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
  
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => completeEvent(event.id)}
                  >
                    <Text style={styles.completeText}>
                      Mark Event Complete
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </AppCard>
        )}
      </ScrollView>
    );
  }
  
  /* COLORS */
  const GREEN = ui.colors.primary;
  const LIGHT_GREEN = ui.colors.primarySoft;
  
  /* STYLES */
  const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: ui.colors.background,
      gap: 16,
      paddingBottom: 40,
    },
  
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  
    loading: {
      color: "#666",
    },
  
    header: {
      marginBottom: 10,
    },
    kicker: {
      color: ui.colors.primaryDark,
      fontSize: 11,
      letterSpacing: 1,
      fontWeight: "700",
      marginBottom: 4,
    },
  
    username: {
      fontSize: 28,
      fontWeight: "bold",
      color: ui.colors.text,
    },
  
    level: {
      color: ui.colors.textMuted,
      marginTop: 6,
    },
  
    badgeRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
      marginTop: 6,
    },
    metaChips: {
      flexDirection: "row",
      gap: 8,
      marginTop: 8,
    },
    metaChip: {
      backgroundColor: "#e6f5e9",
      color: ui.colors.primaryDark,
      borderRadius: ui.radius.pill,
      paddingHorizontal: 10,
      paddingVertical: 6,
      fontSize: 12,
      borderWidth: 1,
      borderColor: "#c7dccb",
      fontWeight: "700",
    },
  
    badge: {
      backgroundColor: LIGHT_GREEN,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#cfe5d0",
    },
  
    badgeText: {
      color: GREEN,
      fontSize: 12,
      fontWeight: "500",
    },
  
    noBadges: {
      fontSize: 12,
      color: ui.colors.textMuted,
    },
  
    card: {
      gap: 6,
    },
  
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: GREEN,
      marginBottom: 10,
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
      marginTop: 8,
      color: ui.colors.textMuted,
    },
  
    timer: {
      fontSize: 12,
      color: ui.colors.textMuted,
      marginBottom: 10,
    },
    rewardBurst: {
      color: ui.colors.primaryDark,
      fontWeight: "800",
      marginBottom: 6,
    },
  
    taskRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
      alignItems: "center",
      paddingVertical: 4,
    },
  
    taskText: {
      fontSize: 14,
      color: ui.colors.text,
    },
  
    taskPoints: {
      fontSize: 12,
      color: ui.colors.textMuted,
    },
  
    checkButton: {
      backgroundColor: GREEN,
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
  
    checkText: {
      color: "white",
      fontWeight: "bold",
    },
  
    empty: {
      color: ui.colors.textMuted,
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
  
    eventCard: {
      marginTop: 10,
      padding: 14,
      backgroundColor: LIGHT_GREEN,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#cfe5d0",
    },
  
    eventTitle: {
      fontWeight: "bold",
      fontSize: 16,
      color: ui.colors.primaryDark,
    },
  
    eventMeta: {
      fontSize: 12,
      color: "#555",
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
      borderRadius: 6,
    },
  
    halfButton: {
      backgroundColor: "#6cae70",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 6,
    },
  
    buttonText: {
      color: "white",
      fontSize: 12,
    },
  
    completeButton: {
      marginTop: 10,
      backgroundColor: ui.colors.primaryDark,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: "center",
    },
  
    completeText: {
      color: "white",
      fontWeight: "bold",
    },
  });