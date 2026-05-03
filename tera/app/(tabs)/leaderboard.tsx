import { View, Text, FlatList, StyleSheet } from "react-native";
import { useLeaderboard } from "../../src/hooks/useLeaderboard";
import { ui } from "@/src/ui/theme";
import { AppCard } from "@/src/ui/components/AppCard";

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
      <Text style={styles.subtitle}>Top eco champions this week</Text>

      <AppCard style={styles.summaryCard}>
        <Text style={styles.summaryText}>
          Gain points by joining events, completing tasks, and helping your local community.
        </Text>
      </AppCard>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => {
          const medal =
            index === 0 ? "🥇" :
            index === 1 ? "🥈" :
            index === 2 ? "🥉" : "";

          const isTop3 = index < 3;

          return (
            <AppCard
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
            </AppCard>
          );
        }}
      />
    </View>
  );
}

const GREEN = ui.colors.primaryDark;
const LIGHT_GREEN = "#edf8ee";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: ui.colors.background,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loading: {
    fontSize: 16,
    color: ui.colors.textMuted,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: GREEN,
  },
  subtitle: {
    color: ui.colors.textMuted,
    marginBottom: 10,
  },
  summaryCard: {
    marginBottom: 14,
    backgroundColor: ui.colors.primarySoft,
  },
  summaryText: {
    color: ui.colors.primaryDark,
    lineHeight: 20,
  },
  list: {
    gap: 10,
    paddingBottom: 24,
  },

  card: {
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    color: ui.colors.text,
    fontWeight: "600",
  },

  points: {
    fontSize: 16,
    fontWeight: "600",
    color: GREEN,
  },
});