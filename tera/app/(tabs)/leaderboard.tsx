import { View, Text, FlatList, StyleSheet } from "react-native";
import { useLeaderboard } from "../../src/hooks/useLeaderboard";

export default function Leaderboard() {
  const { users, loading } = useLeaderboard();

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Loading leaderboard...</Text>
      </View>
    );
  }

  if (users.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>No users yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 TERA Leaderboard</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item, index }) => {
          const medal =
            index === 0 ? "🥇" :
            index === 1 ? "🥈" :
            index === 2 ? "🥉" : "";

          const isTop3 = index < 3;

          return (
            <View
              style={[
                styles.card,
                isTop3 && styles.topCard
              ]}
            >
              {/* LEFT SIDE */}
              <View style={styles.left}>
                <Text style={styles.rank}>
                  {medal || `#${index + 1}`}
                </Text>

                <Text style={styles.username}>
                  {item.username}
                </Text>
              </View>

              {/* RIGHT SIDE */}
              <Text style={styles.points}>
                🌱 {item.points}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const GREEN = "#2e7d32";
const LIGHT_GREEN = "#e8f5e9";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f7f4",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loading: {
    fontSize: 16,
    color: "#666",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: GREEN,
    marginBottom: 16,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  topCard: {
    backgroundColor: LIGHT_GREEN,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  rank: {
    fontSize: 18,
    fontWeight: "bold",
    color: GREEN,
    width: 40,
  },

  username: {
    fontSize: 16,
    color: "#333",
  },

  points: {
    fontSize: 16,
    fontWeight: "600",
    color: GREEN,
  },
});