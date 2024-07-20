import * as React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

function RootLayout() {

  NavigationBar.setBackgroundColorAsync("black");

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack initialRouteName='login' >
        <Stack.Screen
          name="login"
          options={{ title: 'Login Screen', headerShown: false }} />
        <Stack.Screen
          name="forgot-password"
          options={{ title: 'Forget Password Screen', headerShown: false }} />
        <Stack.Screen
          name="register"
          options={{ title: 'Register Screen', headerShown: false }} />
        <Stack.Screen
          name="main/(tabs)"
          options={{ title: 'Main Screen', headerShown: false }} />
      </Stack>
    </>);
}

export default RootLayout;