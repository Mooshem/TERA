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
    const { profile } = useUserProfile();
  
    const [points, setPoints] = useState(0);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [timeLeft, setTimeLeft] = useState("");
    const [managedEvents, setManagedEvents] = useState<any[]>([]);
  
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
          <Text style={styles.level}>Level {level}</Text>
        </View>
  
        {/* PROGRESS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Progress</Text>
  
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
          </View>
  
          <Text style={styles.points}>🌱 {points} pts</Text>
        </View>
  
        {/* DAILY TASKS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Tasks</Text>
          <Text style={styles.timer}>⏳ Refresh in {timeLeft}</Text>
  
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
        </View>
  
        {/* MANAGED EVENTS */}
        {profile.verified && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Managed Events</Text>
  
            {managedEvents.length === 0 ? (
              <Text style={styles.empty}>No active events</Text>
            ) : (
              managedEvents.map((event) => (
                <View key={event.id} style={styles.eventCard}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
  
                  <Text style={styles.eventMeta}>
                    👥 {event.attendees?.length || 0} attending
                  </Text>
  
                  {/* ATTENDEES */}
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
  
                  {/* COMPLETE */}
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
          </View>
        )}
      </ScrollView>
    );
  }
  
  /* COLORS */
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
      color: "#666",
    },
  
    header: {
      marginBottom: 10,
    },
  
    username: {
      fontSize: 28,
      fontWeight: "bold",
      color: GREEN,
    },
  
    level: {
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
      color: GREEN,
      marginBottom: 10,
    },
  
    barBg: {
      height: 12,
      backgroundColor: "#ddd",
      borderRadius: 6,
      overflow: "hidden",
    },
  
    barFill: {
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
      marginBottom: 10,
      alignItems: "center",
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
  
    empty: {
      color: "#777",
    },
  
    /* EVENTS */
    eventCard: {
      marginTop: 10,
      padding: 12,
      backgroundColor: LIGHT_GREEN,
      borderRadius: 10,
    },
  
    eventTitle: {
      fontWeight: "bold",
      fontSize: 16,
    },
  
    eventMeta: {
      fontSize: 12,
      color: "#555",
      marginBottom: 8,
    },
  
    attendeeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 6,
      alignItems: "center",
    },
  
    attendeeName: {
      fontSize: 14,
    },
  
    buttonGroup: {
      flexDirection: "row",
      gap: 6,
    },
  
    fullButton: {
      backgroundColor: GREEN,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
  
    halfButton: {
      backgroundColor: "#66bb6a",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
  
    buttonText: {
      color: "white",
      fontSize: 12,
    },
  
    completeButton: {
      marginTop: 10,
      backgroundColor: "#1b5e20",
      padding: 8,
      borderRadius: 8,
      alignItems: "center",
    },
  
    completeText: {
      color: "white",
      fontWeight: "bold",
    },
  });