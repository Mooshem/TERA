import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../src/firebase";
import { useRouter } from "expo-router";

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
    <View style={{ flex: 1, justifyContent: "center", padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>Welcome to TERA 🌍</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          padding: 12,
          borderRadius: 8,
        }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          padding: 12,
          borderRadius: 8,
        }}
      />

      {error ? (
        <Text style={{ color: "red" }}>{error}</Text>
      ) : null}

      <Pressable
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: "#2e7d32",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Login
          </Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.push("/(auth)/signup")}>
        <Text style={{ textAlign: "center", marginTop: 10 }}>
          Don’t have an account? Sign up
        </Text>
      </Pressable>
    </View>
  );
}