import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../src/firebase";
import { useRouter } from "expo-router";
import { ui } from "@/src/ui/theme";
import { AppCard } from "@/src/ui/components/AppCard";
import { AppButton } from "@/src/ui/components/AppButton";
import { PixelNatureBackdrop } from "@/src/ui/components/PixelNatureBackdrop";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);

      // go straight into app
      router.replace("/(tabs)");
    } catch (e: any) {
      console.log(e);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <PixelNatureBackdrop />

      <View style={styles.brandWrap}>
        <Text style={styles.brand}>TERA</Text>
        <Text style={styles.brandTag}>The Earth Restoration Adventure</Text>
      </View>

      <AppCard style={styles.card}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in and keep building a greener tomorrow.</Text>

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
          <AppButton label="Login" onPress={handleLogin} />
        )}
      </AppCard>

      <Pressable onPress={() => router.push("/(auth)/signup")} style={styles.linkWrap}>
        <Text style={styles.link}>Don&apos;t have an account? Sign up</Text>
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