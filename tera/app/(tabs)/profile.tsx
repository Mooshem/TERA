import { View, Text } from 'react-native';

export default function Profile() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Your Profile</Text>
      <Text>Points: 0</Text>
      <Text>Level: 1</Text>
      <Text>Badges: None yet</Text>
    </View>
  );
}