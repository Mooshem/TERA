import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import { router } from "expo-router";

import { listenToEvents } from "../../src/services/eventService";

export default function Explore() {
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsub = listenToEvents(setEvents);
    return unsub;
  }, []);

  const filtered = events.filter((e) =>
    (e.createdByUsername || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* SEARCH */}
      <TextInput
        placeholder="Search by username..."
        value={search}
        onChangeText={setSearch}
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 10,
          marginBottom: 10,
        }}
      />

      {/* GRID */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 10 }}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              borderRadius: 10,
              overflow: "hidden",
              marginBottom: 10,
            }}
          >
            {/* IMAGE */}
            {item.photoURL ? (
              <Image
                source={{ uri: item.photoURL }}
                style={{ height: 120, width: "100%" }}
              />
            ) : (
              <View
                style={{
                  height: 120,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#eee",
                }}
              >
                <Text>No Image</Text>
              </View>
            )}

            {/* CONTENT */}
            <View style={{ padding: 8, gap: 4 }}>
              <Text style={{ fontWeight: "bold" }}>
                {item.title}
              </Text>

              <Text>📍 {item.location}</Text>
              <Text>🌱 {item.pointsReward} pts</Text>
              <Text>👤 {item.createdByUsername}</Text>

              {/* RSVP COUNT */}
              <Text>
                👥 {item.attendees?.length || 0} going
              </Text>

              {/* NAVIGATE TO DETAIL */}
              <Pressable
                onPress={() => router.push(`/event/${item.id}`)}
                style={{
                  marginTop: 6,
                  backgroundColor: "#2e7d32",
                  padding: 6,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  View
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}