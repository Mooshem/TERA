import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { AppCard } from "@/src/ui/components/AppCard";
import { AppButton } from "@/src/ui/components/AppButton";
import { PixelNatureBackdrop } from "@/src/ui/components/PixelNatureBackdrop";
import { PixelProgressBar } from "@/src/ui/components/PixelProgressBar";
import { PixelIcon } from "@/src/ui/components/PixelIcon";
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
          <View style={styles.statIcon}>
            <PixelIcon type="leaf" size={32} color="#7cb342" />
          </View>
          <Text style={styles.statValue}>{points}</Text>
          <Text style={styles.statLabel}>Total points</Text>
        </AppCard>
        <AppCard style={styles.statCard}>
          <View style={styles.statIcon}>
            <PixelIcon type="badge" size={32} color="#daa520" />
          </View>
          <Text style={styles.statValue}>{profile?.badges?.length || 0}</Text>
          <Text style={styles.statLabel}>Badges earned</Text>
        </AppCard>
      </View>

      <AppCard style={styles.section}>
        <View style={styles.levelRow}>
          <Text style={styles.levelText}>Level {level}</Text>
          <Text style={styles.streakChip}>🔥 {streak} day streak</Text>
        </View>
        <PixelProgressBar 
          progress={progress} 
          height={16}
          color={ui.colors.primary}
          backgroundColor={ui.colors.border}
        />
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
    borderColor: ui.colors.earth,
  },
  eyebrow: {
    color: ui.colors.primaryDark,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: ui.spacing.xs,
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: ui.colors.text,
    marginBottom: ui.spacing.xs,
    textShadowColor: "#fff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  heroBody: {
    color: ui.colors.textMuted,
    fontSize: ui.type.body,
    fontWeight: "500",
  },
  statRow: {
    flexDirection: "row",
    gap: ui.spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: ui.spacing.lg,
  },
  statIcon: {
    marginBottom: ui.spacing.sm,
  },
  statValue: {
    fontSize: 28,
    color: ui.colors.primaryDark,
    fontWeight: "800",
    marginBottom: ui.spacing.xs,
  },
  statLabel: {
    color: ui.colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  section: {
    gap: ui.spacing.sm,
    backgroundColor: ui.colors.surface,
  },
  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ui.spacing.md,
  },
  levelText: {
    color: ui.colors.primaryDark,
    fontWeight: "800",
    fontSize: 20,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  streakChip: {
    backgroundColor: ui.colors.gold,
    color: "#fff",
    paddingHorizontal: ui.spacing.sm,
    paddingVertical: ui.spacing.xs,
    borderRadius: ui.radius.sm,
    borderWidth: 2,
    borderColor: "#b8860b",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
    fontWeight: "600",
    marginTop: ui.spacing.xs,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: ui.type.section,
    fontWeight: "800",
    color: ui.colors.primaryDark,
    marginBottom: ui.spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionBody: {
    color: ui.colors.textMuted,
    fontSize: ui.type.body,
    marginBottom: ui.spacing.md,
    fontWeight: "500",
  },
});
