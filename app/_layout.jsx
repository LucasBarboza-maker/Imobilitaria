import * as React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

function RootLayout() {

  NavigationBar.setBackgroundColorAsync("black");

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack initialRouteName='index' >
        <Stack.Screen
          name="index"
          options={{ title: 'Login Screen', headerShown: false }} />
        <Stack.Screen
          name="forgot-password"
          options={{ title: 'Forget Password Screen', headerShown: false }} />
        <Stack.Screen
          name="register"
          options={{ title: 'Register Screen', headerShown: false }} />
        <Stack.Screen
          name="house-details"
          options={{ title: 'House Details Screen', headerShown: false }} />
        <Stack.Screen
          name="create-house"
          options={{ title: 'Create House Screen', headerShown: false }} />
        <Stack.Screen
          name="main/(tabs)"
          options={{ title: 'Main Screen', headerShown: false }} />
        <Stack.Screen
          name="house-list"
          options={{ title: 'House List Screen', headerShown: false }} />
        <Stack.Screen
          name="profile"
          options={{ title: 'Profile Screen', headerShown: false }} />
        <Stack.Screen
          name="change-password-settings"
          options={{ title: 'Change Password Settings Screen', headerShown: false }} />
        <Stack.Screen
          name="help"
          options={{ title: 'Help Screen', headerShown: false }} />
      </Stack>
    </>);
}

export default RootLayout;