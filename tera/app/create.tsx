import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter, Redirect } from "expo-router";
import { BackNavButton } from "@/src/ui/components/BackNavButton";
import { PixelNatureBackdrop } from "@/src/ui/components/PixelNatureBackdrop";
import { AppCard } from "@/src/ui/components/AppCard";
import { AppButton } from "@/src/ui/components/AppButton";
import { PixelIcon } from "@/src/ui/components/PixelIcon";
import { ui } from "@/src/ui/theme";

import { useUserProfile } from "../src/hooks/useUserProfile";
import { createEvent } from "../src/services/eventService";

export default function Create() {
  const router = useRouter();
  const { profile, loading } = useUserProfile();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [points, setPoints] = useState("10");
  const [photoURL, setPhotoURL] = useState("");

  // 🔒 BLOCK UNVERIFIED USERS
  if (!loading && profile?.verified !== true) {
    return <Redirect href="/(tabs)/profile" />;
  }

  const handleCreate = async () => {
    if (!title || !location || !date) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await createEvent({
        title,
        location,
        date,
        pointsReward: Number(points),
        photoURL,
      });

      alert("Event created!");
      router.replace("/(tabs)/index");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <View style={styles.screen}>
      <PixelNatureBackdrop />
      <View style={styles.container}>
        <BackNavButton fallbackHref="/(tabs)/profile" />
        <View style={styles.header}>
          <PixelIcon type="tree" size={32} color="#4a7c59" />
          <Text style={styles.headerText}>Create Event</Text>
        </View>

        <AppCard style={styles.card}>
          <TextInput
            placeholder="Event Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholderTextColor={ui.colors.textMuted}
          />

          <TextInput
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
            placeholderTextColor={ui.colors.textMuted}
          />

          <TextInput
            placeholder="Date (e.g. May 10, 3PM)"
            value={date}
            onChangeText={setDate}
            style={styles.input}
            placeholderTextColor={ui.colors.textMuted}
          />

          <TextInput
            placeholder="Points Reward"
            value={points}
            onChangeText={setPoints}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor={ui.colors.textMuted}
          />

          <TextInput
            placeholder="Photo URL (optional)"
            value={photoURL}
            onChangeText={setPhotoURL}
            style={styles.input}
            placeholderTextColor={ui.colors.textMuted}
          />
        </AppCard>

        <AppButton 
          label="Create Event" 
          onPress={handleCreate}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: ui.colors.background,
  },
  container: {
    flex: 1,
    padding: ui.spacing.xl,
    gap: ui.spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: ui.spacing.md,
    marginBottom: ui.spacing.lg,
  },
  headerText: {
    fontSize: ui.type.title,
    fontWeight: "800",
    color: ui.colors.primaryDark,
    textTransform: "uppercase",
    letterSpacing: 1,
    textShadowColor: "#fff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  card: {
    gap: ui.spacing.md,
    paddingVertical: ui.spacing.lg,
  },
  input: {
    borderWidth: 2,
    borderColor: ui.colors.border,
    padding: ui.spacing.md,
    borderRadius: ui.radius.sm,
    backgroundColor: ui.colors.surface,
    fontSize: ui.type.body,
    color: ui.colors.text,
    fontWeight: "600",
    marginBottom: ui.spacing.sm,
  },
});