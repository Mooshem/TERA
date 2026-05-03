import { View, Text, FlatList } from "react-native";
import { useLeaderboard } from "../../src/hooks/useLeaderboard";

export default function Leaderboard() {
  const { users, loading } = useLeaderboard();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading leaderboard...</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        🏆 TERA Leaderboard
      </Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View
            style={{
              padding: 12,
              borderBottomWidth: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>
              #{index + 1} {item.username}
            </Text>

            <Text>🌱 {item.points}</Text>
          </View>
        )}
      />
    </View>
  );
}