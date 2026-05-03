import { View, Text } from "react-native";
import { useUserProfile } from "../../src/hooks/useUserProfile";

export default function Profile() {
  const { profile, loading } = useUserProfile();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading profile...</Text>
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
    <View style={{ padding: 20, gap: 10 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>
        {profile.username}
      </Text>

      <Text>Email: {profile.email}</Text>

      <Text style={{ fontSize: 18 }}>
        🌱 Points: {profile.points}
      </Text>

      <Text style={{ fontSize: 18 }}>
        🏅 Badges: {profile.badges.length}
      </Text>
    </View>
  );
}