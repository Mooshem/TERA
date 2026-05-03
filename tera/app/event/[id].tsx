import { View, Text, Image, Pressable, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { BackNavButton } from "@/src/ui/components/BackNavButton";
import { AppCard } from "@/src/ui/components/AppCard";
import { PixelNatureBackdrop } from "@/src/ui/components/PixelNatureBackdrop";
import { CelebrationBurst } from "@/src/ui/components/CelebrationBurst";
import { ui } from "@/src/ui/theme";

import { getEventById, joinEvent } from "../../src/services/eventService";

export default function EventDetail() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<any>(null);
  const [showAttendees, setShowAttendees] = useState(false);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const data = await getEventById(id as string);
      setEvent(data);
    };
    fetch();
  }, [id]);

  if (!event) {
    return (
      <View style={styles.loadingWrap}>
        <PixelNatureBackdrop opacity={0.4} />
        <Text style={styles.loading}>Loading event...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <PixelNatureBackdrop />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <BackNavButton fallbackHref="/(tabs)/explore" />
      <CelebrationBurst triggerKey={burst} message="Event joined!" />

      {event.photoURL && (
        <Image
          source={{ uri: event.photoURL }}
          style={styles.image}
        />
      )}

      <AppCard style={styles.card}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.meta}>📍 {event.location}</Text>
        <Text style={styles.meta}>🌱 Reward: {event.pointsReward}</Text>
        <Text style={styles.meta}>👤 Host: {event.createdByUsername}</Text>
        <Text style={styles.meta}>👥 {event.attendees?.length || 0} going</Text>

        <Pressable
          onPress={async () => {
            await joinEvent(event.id);
            setBurst((prev) => prev + 1);
            const data = await getEventById(id as string);
            setEvent(data);
          }}
          style={({ pressed }) => [styles.joinButton, pressed && styles.pressed]}
        >
          <Text style={styles.joinText}>Join Event</Text>
        </Pressable>
      </AppCard>

      <Pressable
        onPress={() => setShowAttendees(!showAttendees)}
        style={styles.dropdown}
      >
        <Text>{showAttendees ? "Hide Attendees" : "View Attendees"}</Text>
      </Pressable>

      {showAttendees && (
        <AppCard>
          {(event.attendees || []).length === 0 ? (
            <Text>No one joined yet</Text>
          ) : (
            event.attendees.map((user: any, index: number) => (
              <Text key={index}>👤 {user.username}</Text>
            ))
          )}
        </AppCard>
      )}
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: ui.colors.background },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 10, paddingBottom: 28 },
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: ui.colors.background },
  loading: { color: ui.colors.textMuted },
  image: { height: 200, borderRadius: 12, marginBottom: 4 },
  card: { gap: 6, backgroundColor: "rgba(247,251,247,0.94)" },
  title: { fontSize: 24, fontWeight: "800", color: ui.colors.primaryDark },
  meta: { color: ui.colors.textMuted },
  joinButton: {
    marginTop: 8,
    backgroundColor: ui.colors.primary,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: "center",
  },
  joinText: { color: "white", fontWeight: "800" },
  pressed: { transform: [{ scale: 0.98 }] },
  dropdown: {
    marginTop: 4,
    padding: 10,
    backgroundColor: "rgba(234,241,235,0.95)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ui.colors.border,
  },
});