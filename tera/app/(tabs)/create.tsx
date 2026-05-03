import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { createEvent } from "../../src/services/eventService";
import { useUserProfile } from "../../src/hooks/useUserProfile";
import { Redirect, useRouter } from "expo-router";

export default function Create() {
  const router = useRouter();
  const { profile, loading } = useUserProfile();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [points, setPoints] = useState("10");
  const [photoURL, setPhotoURL] = useState("");

  if (!loading && !profile?.verified) {
    return <Redirect href="/(tabs)/explore" />;
  }

  const handleCreate = async () => {
    try {
      await createEvent({
        title,
        location,
        date,
        pointsReward: Number(points),
        photoURL,
      });

      router.push("/(tabs)/explore");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        Create Event 🌍
      </Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 10 }}
      />

      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={{ borderWidth: 1, padding: 10 }}
      />

      <TextInput
        placeholder="Date (YYYY-MM-DDTHH:MM)"
        value={date}
        onChangeText={setDate}
        style={{ borderWidth: 1, padding: 10 }}
      />

      <TextInput
        placeholder="Points Reward"
        value={points}
        onChangeText={setPoints}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 10 }}
      />

      <TextInput
        placeholder="Photo URL"
        value={photoURL}
        onChangeText={setPhotoURL}
        style={{ borderWidth: 1, padding: 10 }}
      />

      <Pressable
        onPress={handleCreate}
        style={{
          backgroundColor: "#2e7d32",
          padding: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>Create Event</Text>
      </Pressable>
    </View>
  );
}