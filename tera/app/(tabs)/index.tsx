import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { AppCard } from "@/src/ui/components/AppCard";
import { AppButton } from "@/src/ui/components/AppButton";
import { ui } from "@/src/ui/theme";

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useUserProfile();
  const points = profile?.points || 0;
  const firstName = profile?.username || "Friend";

  return (
    <View style={styles.screen}>
      <AppCard style={styles.hero}>
        <Text style={styles.eyebrow}>TERA DAILY IMPACT</Text>
        <Text style={styles.heroTitle}>Welcome back, {firstName}</Text>
        <Text style={styles.heroBody}>
          Every action counts. Keep your sustainability momentum alive today.
        </Text>
      </AppCard>

      <View style={styles.statRow}>
        <AppCard style={styles.statCard}>
          <Text style={styles.statValue}>{points}</Text>
          <Text style={styles.statLabel}>Total points</Text>
        </AppCard>
        <AppCard style={styles.statCard}>
          <Text style={styles.statValue}>{profile?.badges?.length || 0}</Text>
          <Text style={styles.statLabel}>Badges earned</Text>
        </AppCard>
      </View>

      <AppCard style={styles.section}>
        <Text style={styles.sectionTitle}>Today&apos;s Eco Mission</Text>
        <Text style={styles.sectionBody}>
          Join a local cleanup or complete one task to unlock your green bonus.
        </Text>
        <AppButton label="Explore Events" onPress={() => router.push("/(tabs)/explore")} />
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
