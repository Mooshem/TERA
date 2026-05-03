import { View, Text } from "react-native";
import { useUserProfile } from "../../src/hooks/useUserProfile";
import { calculateLevel, levelProgress } from "../../src/utils/levelSystem";

export default function Profile() {
  const { profile } = useUserProfile();

  if (!profile) return <Text>Loading...</Text>;

  const level = calculateLevel(profile.points || 0);
  const progress = levelProgress(profile.points || 0);

  return (
    <View style={{ padding: 20, gap: 12 }}>
      {/* USER */}
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>
        {profile.username}
      </Text>

      {/* LEVEL */}
      <Text style={{ fontSize: 18 }}>
        Level {level}
      </Text>

      {/* PROGRESS BAR (simple) */}
      <View
        style={{
          height: 10,
          backgroundColor: "#ddd",
          borderRadius: 5,
        }}
      >
        <View
          style={{
            height: 10,
            width: `${Math.max(0, Math.min(progress * 100, 100))}%`,
            backgroundColor: "#2e7d32",
            borderRadius: 5,
          }}
        />
      </View>

      {/* POINTS */}
      <Text>🌱 Points: {profile.points}</Text>

      {/* STREAK */}
      <Text>🔥 Streak: {profile.streak?.current || 0} days</Text>

      {/* BADGES */}
      <Text style={{ marginTop: 10, fontWeight: "bold" }}>
        Badges
      </Text>

      {(profile.badges || []).map((b: string) => (
        <Text key={b}>🏅 {b}</Text>
      ))}
    </View>
  );
}