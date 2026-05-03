import { View, Text } from "react-native";
import { useUserProfile } from "../../src/hooks/useUserProfile";

export default function Profile() {
  const { profile, loading } = useUserProfile();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No profile found</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20, gap: 12 }}>
      {/* Header */}
      <Text style={{ fontSize: 30, fontWeight: "bold" }}>
        {profile.username}
      </Text>

      <Text style={{ fontSize: 16, color: "gray" }}>
        {profile.email}
      </Text>

      {/* Stats Card */}
      <View
        style={{
          marginTop: 20,
          padding: 15,
          borderWidth: 1,
          borderRadius: 10,
        }}
      >
        <Text style={{ fontSize: 18 }}>
          🌱 Points: {profile.points}
        </Text>

        <Text style={{ fontSize: 18, marginTop: 5 }}>
          🏅 Badges: {profile.badges.length}
        </Text>
      </View>

      {/* Badges Section */}
      <Text style={{ fontSize: 20, marginTop: 20 }}>
        Achievements
      </Text>

      {profile.badges.length === 0 ? (
        <Text style={{ color: "gray" }}>
          No badges yet — start participating in cleanup events 🌍
        </Text>
      ) : (
        profile.badges.map((b, i) => (
          <Text key={i} style={{ fontSize: 16 }}>
            {b === "beginner" && "🌱 Beginner Eco Warrior"}
            {b === "active" && "🌍 Active Contributor"}
            {b === "leader" && "🏆 Community Leader"}
          </Text>
        ))
      )}
    </View>
  );
}