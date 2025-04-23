import { Stack } from "expo-router";
import React from 'react'

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="guestHome" />
      <Stack.Screen name="home" />
      <Stack.Screen name="searchPage" />
      <Stack.Screen name="doctorDetails" />
      <Stack.Screen name="userProfile" />
      <Stack.Screen name="editUser" />
    </Stack>
  );
}
