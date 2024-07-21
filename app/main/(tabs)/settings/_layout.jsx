import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from 'expo-router';

function HomeScreen() {
  const navigation = useNavigation();

  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings</Text>
      </View>
  );
}

export default HomeScreen;