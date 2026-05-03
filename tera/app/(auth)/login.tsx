import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TEMP: mock authentication
    if (username === 'test' && password === '123') {
      // Go to tabs after login
      router.replace('/(tabs)');
    } else {
      alert('User not found. Would you like to create an account?');
    }
  };

  const goToSignup = () => {
    router.push('/(auth)/signup');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          marginBottom: 10,
          padding: 10,
          borderRadius: 5,
        }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          marginBottom: 20,
          padding: 10,
          borderRadius: 5,
        }}
      />

      <Button title="Login" onPress={handleLogin} />

      <View style={{ marginTop: 15 }}>
        <Button title="Create Account" onPress={goToSignup} />
      </View>
    </View>
  );
}