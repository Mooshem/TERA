import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { AppCard } from "@/src/ui/components/AppCard";
import { AppButton } from "@/src/ui/components/AppButton";
import { PixelNatureBackdrop } from "@/src/ui/components/PixelNatureBackdrop";
import { ui } from "@/src/ui/theme";
import { calculateLevel, levelProgress } from "@/src/utils/levelSystem";

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useUserProfile();
  const points = profile?.points || 0;
  const firstName = profile?.username || "Friend";
  const level = calculateLevel(points);
  const progress = levelProgress(points);
  const streak = profile?.streak?.current || 0;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: Math.max(0.08, progress),
      duration: 650,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  return (
    <View style={styles.screen}>
      <PixelNatureBackdrop />
      <AppCard style={styles.hero}>
        <Text style={styles.eyebrow}>TERA DAILY IMPACT</Text>
        <Text style={styles.heroTitle}>Welcome back, {firstName}</Text>
        <Text style={styles.heroBody}>
          Every action counts. Keep your sustainability momentum alive today.
        </Text>
      </AppCard>

      <View style={styles.statRow}>
        <AppCard style={styles.statCard}>
          <Text style={styles.statValue}>🌱 {points}</Text>
          <Text style={styles.statLabel}>Total points</Text>
        </AppCard>
        <AppCard style={styles.statCard}>
          <Text style={styles.statValue}>🏅 {profile?.badges?.length || 0}</Text>
          <Text style={styles.statLabel}>Badges earned</Text>
        </AppCard>
      </View>

      <AppCard style={styles.section}>
        <View style={styles.levelRow}>
          <Text style={styles.levelText}>Level {level}</Text>
          <Text style={styles.streakChip}>🔥 {streak} day streak</Text>
        </View>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{Math.round(progress * 100)}% to next level</Text>

        <Text style={styles.sectionTitle}>Today&apos;s Eco Mission</Text>
        <Text style={styles.sectionBody}>
          Join a local cleanup or complete one task to unlock your green bonus.
        </Text>
        <AppButton label="Explore Events" onPress={() => router.push("/(tabs)/explore")} />
        <AppButton
          label="View Leaderboard"
          variant="secondary"
          compact
          onPress={() => router.push("/(tabs)/leaderboard")}
        />
      </AppCard>

      <AppCard style={styles.section}>
        <Text style={styles.sectionTitle}>TERA Tip of the day</Text>
        <Text style={styles.sectionBody}>
          Bring a reusable bottle and container. Two swaps can prevent hundreds of disposables.
        </Text>
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: ui.colors.background,
    padding: ui.spacing.xl,
    gap: ui.spacing.md,
  },
  hero: {
    backgroundColor: ui.colors.primarySoft,
    borderColor: ui.colors.accent,
  },
  eyebrow: {
    color: ui.colors.primaryDark,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
    marginBottom: ui.spacing.xs,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: ui.colors.text,
    marginBottom: ui.spacing.xs,
  },
  heroBody: {
    color: ui.colors.textMuted,
    fontSize: ui.type.body,
  },
  statRow: {
    flexDirection: "row",
    gap: ui.spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 26,
    color: ui.colors.primaryDark,
    fontWeight: "700",
  },
  statLabel: {
    color: ui.colors.textMuted,
    fontSize: 13,
  },
  section: {
    gap: ui.spacing.sm,
    backgroundColor: "rgba(247,251,247,0.94)",
  },
  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  levelText: {
    color: ui.colors.primaryDark,
    fontWeight: "700",
  },
  streakChip: {
    backgroundColor: "#fff2dc",
    color: "#8a5a00",
    paddingHorizontal: ui.spacing.sm,
    paddingVertical: ui.spacing.xs,
    borderRadius: ui.radius.pill,
    borderWidth: 1,
    borderColor: "#f3d59a",
    fontSize: 12,
    fontWeight: "700",
  },
  progressTrack: {
    height: 10,
    borderRadius: ui.radius.pill,
    overflow: "hidden",
    backgroundColor: "#d8e7d9",
  },
  progressFill: {
    height: "100%",
    backgroundColor: ui.colors.primary,
  },
  progressText: {
    color: ui.colors.textMuted,
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: ui.type.section,
    fontWeight: "700",
    color: ui.colors.primaryDark,
  },
  sectionBody: {
    color: ui.colors.textMuted,
    fontSize: ui.type.body,
  },
});
