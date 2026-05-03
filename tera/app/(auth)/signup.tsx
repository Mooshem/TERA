import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../src/firebase";
import { useRouter } from "expo-router";
import { ui } from "@/src/ui/theme";
import { AppCard } from "@/src/ui/components/AppCard";
import { AppButton } from "@/src/ui/components/AppButton";
import { BackNavButton } from "@/src/ui/components/BackNavButton";
import { PixelNatureBackdrop } from "@/src/ui/components/PixelNatureBackdrop";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (!email || !password || !username) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Create auth user
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCred.user;

      // 2. Create Firestore profile
      await setDoc(doc(db, "users", user.uid), {
        username: username.trim(),
        email: email.trim(),
        points: 0,
        badges: [],
        verified: false,
      });

      // 3. Go into app
      router.replace("/(tabs)");
    } catch (e: any) {
      console.log(e);
      setError("Signup failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <PixelNatureBackdrop />
      <BackNavButton fallbackHref="/(auth)/login" label="Login" style={styles.backButton} />

      <View style={styles.brandWrap}>
        <Text style={styles.brand}>TERA</Text>
        <Text style={styles.brandTag}>The Earth Restoration Adventure</Text>
      </View>

      <AppCard style={styles.card}>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Join TERA and turn daily actions into visible impact.</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          placeholder="Username"
          placeholderTextColor={ui.colors.textMuted}
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Email"
          placeholderTextColor={ui.colors.textMuted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Password"
          placeholderTextColor={ui.colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading ? (
          <View style={styles.loadingButton}>
            <ActivityIndicator color="#fff" />
          </View>
        ) : (
          <AppButton label="Create Account" onPress={handleSignup} />
        )}
      </AppCard>

      <Pressable onPress={() => router.push("/(auth)/login")} style={styles.linkWrap}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: ui.spacing.xl,
    backgroundColor: ui.colors.background,
    gap: ui.spacing.md,
    overflow: "hidden",
  },
  brandWrap: {
    alignItems: "center",
    gap: 2,
  },
  backButton: {
    marginBottom: ui.spacing.xs,
  },
  brand: {
    fontSize: 34,
    fontWeight: "800",
    color: ui.colors.primaryDark,
    letterSpacing: 2,
  },
  brandTag: {
    color: ui.colors.textMuted,
    fontSize: 13,
  },
  card: {
    gap: ui.spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: ui.colors.text,
  },
  subtitle: {
    fontSize: ui.type.body,
    color: ui.colors.textMuted,
  },
  label: {
    color: ui.colors.primaryDark,
    fontWeight: "600",
    fontSize: 13,
    marginBottom: -4,
  },
  input: {
    borderWidth: 1,
    borderColor: ui.colors.border,
    borderRadius: ui.radius.sm,
    paddingHorizontal: ui.spacing.md,
    paddingVertical: ui.spacing.md,
    backgroundColor: ui.colors.surface,
  },
  error: {
    color: ui.colors.danger,
    backgroundColor: "#fdecea",
    borderRadius: ui.radius.sm,
    padding: ui.spacing.sm,
  },
  loadingButton: {
    minHeight: 44,
    borderRadius: ui.radius.sm,
    backgroundColor: ui.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  link: {
    textAlign: "center",
    color: ui.colors.primaryDark,
    fontWeight: "600",
  },
  linkWrap: {
    paddingVertical: 4,
  },
});