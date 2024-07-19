import * as React from 'react';
import { Stack } from 'expo-router';

function App() {
  return (
    <Stack>
      <Stack.Screen
        name="home/index"
        options={
          {
            headerTitle:"Home"
          }
        }
      />
      <Stack.Screen
        name="login/index"
        options={
          {
            title: 'Login Screen',
          }
        }
      />
    </Stack>);
}

export default App;