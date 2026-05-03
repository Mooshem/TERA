import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../src/firebase";
import { useRouter } from "expo-router";

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
        createdAt: serverTimestamp(),
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
    <View style={{ flex: 1, justifyContent: "center", padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>
        Join TERA 🌍
      </Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <Pressable
        onPress={handleSignup}
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
            Create Account
          </Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.push("/(auth)/login")}>
        <Text style={{ textAlign: "center", marginTop: 10 }}>
          Already have an account? Login
        </Text>
      </Pressable>
    </View>
  );
}