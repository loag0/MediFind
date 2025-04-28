import { SplashScreen, Stack, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Roboto': require('../assets/fonts/Roboto-Regular.ttf'),
  });
  const segments = useSegments();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, navigate to home
        if (segments[0] as string === 'index') {
          // Only navigate if the current route is the index
          window.location.replace('/home');
        }
      } else {
        // User is signed out, navigate to login
        if (segments[0] !== 'login' && segments[0] !== 'register') {
          window.location.replace('/login');
        }
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }
  , [segments]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="guestHome" />
        <Stack.Screen name="home" />
        <Stack.Screen name="searchPage" />
        <Stack.Screen name="Booking" />
        <Stack.Screen name="userProfile" />
      </Stack>
    </>
  );
}
