import { View, Text, Button } from 'react-native';

export default function Login() {
  const handlePress = () => {
    console.log('Google Sign-In clicked (not implemented yet)');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        TERA Login
      </Text>

      <Button title="Sign in with Google" onPress={handlePress} />
    </View>
  );
}