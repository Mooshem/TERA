import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { BackNavButton } from "@/src/ui/components/BackNavButton";

import { getEventById, joinEvent } from "../../src/services/eventService";

export default function EventDetail() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<any>(null);
  const [showAttendees, setShowAttendees] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const data = await getEventById(id as string);
      setEvent(data);
    };
    fetch();
  }, [id]);

  if (!event) {
    return <Text style={{ padding: 20 }}>Loading event...</Text>;
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <BackNavButton fallbackHref="/(tabs)/explore" />

      {/* IMAGE */}
      {event.photoURL && (
        <Image
          source={{ uri: event.photoURL }}
          style={{
            height: 200,
            borderRadius: 10,
            marginBottom: 10,
          }}
        />
      )}

      {/* TITLE */}
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        {event.title}
      </Text>

      <Text>📍 {event.location}</Text>
      <Text>🌱 Reward: {event.pointsReward}</Text>
      <Text>👤 Host: {event.createdByUsername}</Text>

      {/* RSVP COUNT */}
      <Text style={{ marginTop: 10 }}>
        👥 {event.attendees?.length || 0} going
      </Text>

      {/* JOIN BUTTON */}
      <Pressable
        onPress={async () => {
          await joinEvent(event.id);
          alert("Joined event");
        }}
        style={{
          marginTop: 12,
          backgroundColor: "#2e7d32",
          padding: 10,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Join Event
        </Text>
      </Pressable>

      {/* DROPDOWN */}
      <Pressable
        onPress={() => setShowAttendees(!showAttendees)}
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: "#eee",
          borderRadius: 8,
        }}
      >
        <Text>
          {showAttendees ? "Hide Attendees" : "View Attendees"}
        </Text>
      </Pressable>

      {/* ATTENDEE LIST */}
      {showAttendees && (
        <View style={{ marginTop: 10 }}>
          {(event.attendees || []).length === 0 ? (
            <Text>No one joined yet</Text>
          ) : (
            event.attendees.map((user: any, index: number) => (
              <Text key={index}>👤 {user.username}</Text>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}