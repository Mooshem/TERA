import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter, Redirect } from "expo-router";
import { BackNavButton } from "@/src/ui/components/BackNavButton";

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
    <View style={styles.container}>
      <BackNavButton fallbackHref="/(tabs)/profile" />
      <Text style={styles.header}>Create Event 🌍</Text>

      <TextInput
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      <TextInput
        placeholder="Date (e.g. May 10, 3PM)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />

      <TextInput
        placeholder="Points Reward"
        value={points}
        onChangeText={setPoints}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Photo URL (optional)"
        value={photoURL}
        onChangeText={setPhotoURL}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Create Event</Text>
      </TouchableOpacity>
    </View>
  );
}

const GREEN = "#2e7d32";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f7f4",
    gap: 12,
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: GREEN,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "white",
  },

  button: {
    backgroundColor: GREEN,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});