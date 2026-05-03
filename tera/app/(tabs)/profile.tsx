import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useUserProfile } from "../../src/hooks/useUserProfile";
import { calculateLevel, levelProgress } from "../../src/utils/levelSystem";

export default function Profile() {
  const { profile } = useUserProfile();

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  const level = calculateLevel(profile.points || 0);
  const progress = levelProgress(profile.points || 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.username}>{profile.username}</Text>
        <Text style={styles.level}>Level {level}</Text>
      </View>

      {/* PROGRESS CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Progress</Text>

        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.max(0, Math.min(progress * 100, 100))}%` },
            ]}
          />
        </View>

        <Text style={styles.points}>🌱 {profile.points} points</Text>
      </View>

      {/* STATS CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Stats</Text>
        <Text style={styles.stat}>🔥 Streak: {profile.streak?.current || 0} days</Text>
      </View>

      {/* BADGES */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Badges</Text>

        <View style={styles.badgeContainer}>
          {(profile.badges || []).length === 0 ? (
            <Text style={styles.empty}>No badges yet</Text>
          ) : (
            (profile.badges || []).map((b: string) => (
              <View key={b} style={styles.badge}>
                <Text style={styles.badgeText}>🏅 {b}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

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
    fontSize: 16,
    color: "#666",
  },

  header: {
    marginBottom: 10,
  },

  username: {
    fontSize: 30,
    fontWeight: "bold",
    color: GREEN,
  },

  level: {
    fontSize: 18,
    color: "#555",
  },

  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: GREEN,
  },

  progressBarBackground: {
    height: 12,
    backgroundColor: "#ddd",
    borderRadius: 6,
    overflow: "hidden",
  },

  progressBarFill: {
    height: 12,
    backgroundColor: GREEN,
  },

  points: {
    marginTop: 8,
    fontSize: 14,
    color: "#333",
  },

  stat: {
    fontSize: 16,
    color: "#333",
  },

  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  badge: {
    backgroundColor: LIGHT_GREEN,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  badgeText: {
    color: GREEN,
    fontWeight: "500",
  },

  empty: {
    color: "#777",
  },
});