import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from 'expo-router';

function LoginScreen({  }) {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Login Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('home/index')}
      />
    </View>
  );
}

export default LoginScreen;